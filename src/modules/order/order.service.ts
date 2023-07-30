import { BadRequestException, Inject, Injectable, forwardRef } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { randomKey } from "../../common/utils";
import { TIME_ORDER } from "../../constants/order";
import { MailService } from "../mail/mail.service";
import { PrismaService } from "../prisma/prisma.service";
import { TableFoodService } from "../table-food/table-food.service";
import { CreateOrderDto, GetOrderQuery, GetTableOrderQuery } from "./dto/order.dto";
import { OrderEntity } from "./entity/order";

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
    @Inject(forwardRef(() => TableFoodService)) private tableFood: TableFoodService
  ) {}

  async find() {
    return await this.prisma.order.findMany();
  }

  async findAll(query: GetOrderQuery) {
    const { page, size, status, restaurant_id, date, table_id } = query;
    const skip = (page - 1) * size;

    const condition: any = {
      restaurantId: restaurant_id,
      isDelete: false
    };
    if (status) {
      condition["confirm"] = {
        equals: status === "inactive" ? false : true
      };
    }
    if (date) {
      condition["date"] = {
        equals: new Date(date).toDateString()
      };
    }
    if (table_id) {
      condition["tableId"] = table_id;
    }
    const conditionSort: any = [{ confirm: "asc" }, { date: "desc" }, { time: "asc" }];
    const [data, total] = await Promise.all([
      this.prisma.order.findMany({
        where: {
          ...condition
        },
        orderBy: conditionSort,
        skip,
        take: +size
      }),
      this.prisma.order.count({
        where: {
          ...condition
        }
      })
    ]);
    return {
      total,
      data
    };
  }

  async findByTableOrder({ restaurant_id, table_id }: { table_id: number; restaurant_id: number }) {
    const condition: any = {
      restaurantId: restaurant_id,
      isDelete: false
    };

    condition["date"] = {
      equals: new Date().toDateString()
    };
    if (table_id) {
      condition["tableId"] = table_id;
    }

    return await this.prisma.order.findMany({
      where: {
        ...condition
      },
      orderBy: [{ time: "asc" }]
    });
  }

  async getById(id: number) {
    return await this.prisma.order.findFirst({
      where: { id, isDelete: false },
      include: {
        Restaurant: {
          include: {
            Province: true,
            District: true
          }
        },
        TableFood: true
      }
    });
  }

  async findByKey(key = "") {
    return await this.prisma.order.findFirst({
      where: { key, isDelete: false },
      include: {
        Restaurant: {
          include: {
            Province: true,
            District: true
          }
        },
        TableFood: true
      }
    });
  }

  async getTableOrder(id: number, query: GetTableOrderQuery) {
    const { restaurantId } = query;

    const order = await this.prisma.order.findFirst({
      where: { id, restaurantId }
    });
    if (!order) {
      throw new BadRequestException("Yêu cầu không tồn tại.");
    }
    const date = new Date(order.date).toDateString();
    const dateOrder = new Date(date).getTime();
    const dateNow = new Date(new Date().toDateString()).getTime();
    if (dateOrder < dateNow) {
      throw new BadRequestException("Thời gian đặt đã kết thúc");
    }
    let listOrder = await this.prisma.order.findMany({
      where: {
        date: order.date,
        restaurantId: restaurantId,
        confirm: true,
        isDelete: false
      }
    });
    const indexOfOrderTime = TIME_ORDER.findIndex((value) => value === order.time) || 0;
    listOrder = listOrder.filter((item) => {
      const indexIt = TIME_ORDER.findIndex((value) => value === item.time) || 0;
      if (Math.abs(indexOfOrderTime - indexIt) <= 4) {
        return true;
      }
      return false;
    });
    const tablePending = listOrder?.map((item) => item.tableId);
    if (dateOrder === dateNow) {
      return this.tableFood.getTableOrder({ tablePending, restaurantId });
    }
    return this.tableFood.getTableOrder({ tablePending, restaurantId }, true);
  }

  async create(data: CreateOrderDto) {
    let loop = true;
    let key = "";
    let tryKey = 6;
    do {
      key = randomKey();
      const check = await this.prisma.order.count({
        where: {
          key: key
        }
      });
      if (check === 0) {
        loop = false;
      }
      tryKey--;
    } while (loop && tryKey > 0);
    if (!key) {
      throw new BadRequestException("Đã có lỗi xảy ra vui lòng thử lại sau");
    }
    const checkSpam = await this.prisma.order.findFirst({
      where: {
        email: data?.email,
        date: data?.date,
        time: data?.time,
        isDelete: false
      }
    });
    if (checkSpam) {
      throw new BadRequestException("Email đã được sử dụng trong thời gian đã chọn.");
    }
    const res = await this.prisma.order
      .create({
        data: {
          name: data?.name,
          phone: data?.phone,
          email: data?.email,
          date: data?.date,
          time: data?.time,
          person: data?.person,
          children: data?.children,
          restaurantId: data?.restaurantId,
          key
        }
      })
      .catch((error) => {
        throw error;
      });
    res?.key &&
      (await this.mailService.sendConfirmation({
        email: data?.email,
        name: data?.name,
        key: res?.key
      }));
    return plainToClass(OrderEntity, res);
  }

  async cancelOrder(id: number, query: any) {
    const { msg } = query;
    const check = await this.prisma.order.findFirst({
      where: {
        id: id
      }
    });
    if (!check) {
      throw new BadRequestException("Yêu cầu không tồn tại.");
    }
    check.tableId &&
      (await this.tableFood.updateTableOrderCancel({
        tId: check.tableId,
        oId: check.id
      }));
    await Promise.all([
      this.prisma.order.update({
        where: { id },
        data: {
          isDelete: true
        }
      }),
      this.mailService.sendCancelOrder({
        email: check?.email,
        name: check?.name,
        msg: msg || "Hết bàn trong thời gian bạn đã đặt."
      })
    ]);
    return true;
  }

  async delete(id: number, query: any) {
    const { key } = query;
    if (!key) {
      throw new BadRequestException("Đầu vào không hợp lệ.");
    }
    const check = await this.prisma.order.findFirst({
      where: {
        id: id,
        confirm: false,
        key
      }
    });
    if (!check) {
      throw new BadRequestException("Yêu cầu đã được xác nhận hoặc không tồn tại.");
    }
    await this.prisma.order.delete({
      where: { id }
    });
    return true;
  }

  async hideOrder(id: number) {
    await this.prisma.order.update({
      where: { id },
      data: {
        isDelete: true
      }
    });
  }

  async update(id: number, query: any, data: CreateOrderDto) {
    const { key } = query;
    if (!key) {
      throw new BadRequestException("Đầu vào không hợp lệ.");
    }
    const check = await this.prisma.order.findFirst({
      where: {
        id: id,
        confirm: false,
        key
      }
    });
    if (!check) {
      throw new BadRequestException("Yêu cầu đã được xác nhận hoặc không tồn tại.");
    }
    await this.prisma.order.update({
      where: {
        id: id
      },
      data: {
        ...data
      }
    });
    return true;
  }

  async updateSelectTable(id: number, data: CreateOrderDto) {
    const check = await this.prisma.order.findFirst({
      where: {
        id: id
      }
    });
    if (!check) {
      throw new BadRequestException("Yêu cầu không tồn tại.");
    }
    await this.prisma.order.update({
      where: {
        id: id
      },
      data: {
        ...data
      }
    });
    !check.confirm &&
      (await this.mailService.sendConfirmOrder({
        name: check.name,
        key: check.key,
        email: check.email
      }));
    return true;
  }
}
