import { BadRequestException, ConflictException, Inject, Injectable, forwardRef } from "@nestjs/common";
import { Interval } from "@nestjs/schedule";
import { plainToClass } from "class-transformer";
import { TableFoodStatus } from "../../constants/tablefood";
import { PrismaService } from "../prisma/prisma.service";
import { OrderService } from "./../order/order.service";
import { CreateTableFoodDto } from "./dto/create-table-food.dto";
import { EditTableDto } from "./dto/edit-table-food.dto";
import { GetTableFoodQuery } from "./dto/get-table-food.dto";
import { TableFoodEnity } from "./entities/table-food.entity";

@Injectable()
export class TableFoodService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => OrderService)) private orderService: OrderService
  ) {}

  async find(query: GetTableFoodQuery) {
    const { q, status, restaurant_id } = query;
    const conditions = {};
    await this.updateTableOrder();
    if (q) {
      conditions["name"] = {
        contains: q
      };
    }
    if (status) {
      conditions["status"] = status;
    }
    if (restaurant_id) {
      conditions["restaurantId"] = restaurant_id;
    }
    return this.prisma.tableFood.findMany({
      where: { ...conditions, isDelete: false },
      include: {
        Order: true
      },
      orderBy: [
        {
          id: "asc"
        },
        {
          name: "asc"
        }
      ]
    });
  }

  async findById(id: number) {
    await this.updateTableOrder(id);
    return this.prisma.tableFood.findFirst({
      where: {
        id
      },
      include: {
        OrderNext: true,
        BillTableOrder: true
      }
    });
  }

  async create(data: CreateTableFoodDto) {
    const exitrestaurant = await this.prisma.restaurant.count({
      where: {
        id: data.restaurantId
      }
    });
    if (!exitrestaurant) {
      throw new ConflictException("Nhà hàng không tồn tại. Vui lòng thử lại!");
    }

    const nameUnique = await this.prisma.tableFood.count({
      where: {
        name: data.name,
        restaurantId: data.restaurantId
      }
    });
    if (nameUnique) {
      throw new ConflictException("Tên bàn đã tồn tại. Vui lòng thử lại!");
    }

    const res = await this.prisma.tableFood
      .create({
        data: {
          name: data.name,
          description: data.description,
          prePaymentAmount: data.prePaymentAmount || 0,
          restaurantId: data.restaurantId,
          status: "FREE"
        }
      })
      .catch((error) => {
        throw error;
      });

    return plainToClass(TableFoodEnity, res);
  }

  @Interval(60000 * 30)
  async updateTableOrder(id?: number) {
    const conditions: any = {};
    if (id) {
      conditions["id"] = {
        in: [id]
      };
    }
    const listTable = await this.prisma.tableFood.findMany({
      where: {
        status: "FREE",
        isDelete: false,
        ...conditions
      }
    });

    let listTableOrder = await Promise.all(
      listTable.map(async (item) => {
        const listOrderByTable = await this.orderService.findByTableOrder({
          restaurant_id: item.restaurantId,
          table_id: item.id
        });
        return { ...item, listOrderByTable };
      })
    );

    listTableOrder = listTableOrder.map((item) => {
      const orderFind = item.listOrderByTable.find((or) => {
        const currentTine = new Date().getTime();
        const orderTime = new Date(or.date + " " + or.time.replace("h", "")).getTime();
        if (orderTime - currentTine > 0 && Math.round((orderTime - currentTine) / 60000) <= 120) {
          return true;
        }
        return false;
      });
      return { ...item, orderId: orderFind?.id || null, status: orderFind ? "PENDING" : "FREE" };
    });
    listTableOrder = listTableOrder.filter((item) => item.status === "PENDING");
    await Promise.all(
      listTableOrder?.map((item) =>
        this.prisma.tableFood.update({
          where: {
            id: item?.id
          },
          data: {
            status: item?.status,
            orderId: item?.orderId
          }
        })
      )
    );
  }

  async editTableFood(id: number, dto: EditTableDto) {
    const exitTableFood = await this.prisma.tableFood.count({
      where: {
        id: id
      }
    });
    if (!exitTableFood) {
      throw new ConflictException("Bàn không tồn tại!");
    }

    const res = await this.prisma.tableFood
      .update({
        where: {
          id: id
        },
        data: {
          ...dto
        }
      })
      .catch((error) => {
        throw error;
      });
    return plainToClass(TableFoodEnity, res);
  }

  async getTableOrder(
    { tablePending, restaurantId }: { tablePending: number[]; restaurantId: number },
    isCurrentDay = true
  ) {
    if (isCurrentDay) {
      return this.prisma.tableFood.findMany({
        where: {
          id: {
            notIn: tablePending
          },
          status: "FREE",
          restaurantId,
          isDelete: false
        },
        orderBy: [
          {
            id: "asc"
          }
        ]
      });
    }
    return this.prisma.tableFood.findMany({
      where: {
        id: {
          notIn: tablePending
        },
        restaurantId,
        isDelete: false
      },
      orderBy: [
        {
          id: "asc"
        }
      ]
    });
  }

  async updateTableOrderCancel({ tId, oId }: { tId: number; oId: number }) {
    const exitTableFood = await this.prisma.tableFood.findFirst({
      where: {
        id: tId,
        orderId: oId
      }
    });
    if (exitTableFood) {
      await this.prisma.tableFood.update({
        where: {
          id: exitTableFood.id
        },
        data: {
          orderId: null,
          status: "FREE"
        }
      });
    }
    return;
  }

  async updateUseTable({ tId, status }: { tId: number; status: TableFoodStatus }) {
    const exitTableFood = await this.prisma.tableFood.findFirst({
      where: {
        id: tId
      },
      include: {
        BillTableOrder: true
      }
    });
    if (!exitTableFood) {
      throw new BadRequestException("Bàn không tồn tại");
    }
    if (status === TableFoodStatus.FREE) {
      await Promise.all([
        exitTableFood.orderId && this.orderService.hideOrder(exitTableFood.orderId),
        await this.prisma.tableFood.update({
          where: {
            id: exitTableFood.id
          },
          data: {
            orderId: null,
            status: TableFoodStatus.FREE
          }
        })
      ]);
      return true;
    }
    await this.prisma.tableFood.update({ where: { id: tId }, data: { status: status } });
    return true;
  }
}
