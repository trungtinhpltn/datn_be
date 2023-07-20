import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CustomerService } from "../customer/customer.service";
import { GetBillQuery, GetReportQuery, ICreateBill, UpdateBill } from "./dto/bill.dto";
import { BillTableOrderService } from "../bill-table-order/bill-table-order.service";
import { TableFoodService } from "../table-food/table-food.service";
import { TableFoodStatus } from "../../constants/tablefood";
import { BillItemService } from "../bill-item/bill-item.service";
import { BillStatus } from "@prisma/client";

@Injectable()
export class BillService {
  constructor(
    private prisma: PrismaService,
    private customerService: CustomerService,
    private billTableOrderService: BillTableOrderService,
    private tableFoodService: TableFoodService,
    private billItemService: BillItemService
  ) {}

  async findAll() {
    return await this.prisma.bill.findMany();
  }

  async findByQuery(query: GetBillQuery) {
    const { page, size, status, restaurant_id } = query;
    const skip = (page - 1) * size;

    const condition: any = {
      restaurantId: restaurant_id
    };
    if (status) {
      condition["status"] = status;
    }

    // const conditionSort: any = [{ confirm: "asc" }, { date: "desc" }, { time: "asc" }];
    const [data, total] = await Promise.all([
      this.prisma.bill.findMany({
        where: {
          ...condition
        },
        skip,
        take: +size,
        orderBy: {
          createdAt: "desc"
        }
      }),
      this.prisma.bill.count({
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

  async getReport(query: GetReportQuery) {
    const { from, to, restaurant_id } = query;
    let start = from;
    const data: any = [];
    do {
      const res = await this.prisma.bill.findMany({
        where: {
          restaurantId: restaurant_id,
          status: BillStatus.CONFIRM,
          exportDate: {
            equals: start
          }
        }
      });
      if (res?.length > 0) {
        const totalP = res?.reduce((p, bill) => p + bill.paymentPrice, 0);
        data.push({ date: start, totalPrice: totalP, totalBill: res?.length });
      }
      start += 86400;
    } while (start <= to);
    return data;
  }

  async getById(id: number) {
    return await this.prisma.bill.findFirst({
      where: { id },
      include: {
        billItems: {
          include: {
            MenuItem: true
          },
          orderBy: [
            {
              createdAt: "asc"
            }
          ]
        },
        Customer: true,
        billTableOrder: true
      }
    });
  }

  async create(data: ICreateBill) {
    if (!data.tableId) {
      throw new BadRequestException("Dữ liệu đầu vào không hợp lệ");
    }

    const checkTableIsUsing = await this.billTableOrderService.checkTableIsUsing(data.tableId);
    if (checkTableIsUsing) {
      throw new BadRequestException("Bàn đang được sử dụng");
    }
    if (data.customer) {
      const customer = await this.customerService.create(data.customer);
      const bill = await this.prisma.bill.create({
        data: {
          customerId: customer.id,
          restaurantId: data.restaurantId
        }
      });
      await this.tableFoodService.updateUseTable({ tId: data.tableId, status: TableFoodStatus.ACTIVE });
      await this.billTableOrderService.create({
        tableId: data.tableId,
        billId: bill.id
      });
      return this.prisma.bill.findFirst({ where: { id: bill.id } });
    }

    const bill = await this.prisma.bill.create({
      data: {
        restaurantId: data.restaurantId
      }
    });
    await this.tableFoodService.updateUseTable({ tId: data.tableId, status: TableFoodStatus.ACTIVE });
    await this.billTableOrderService.create({
      tableId: data.tableId,
      billId: bill.id
    });
    return this.prisma.bill.findFirst({ where: { id: bill.id } });
    // return true;
  }

  async delete(id: number) {
    const bill = await this.prisma.bill.findFirst({
      where: { id },
      include: {
        billTableOrder: true
      }
    });
    if (!bill) {
      throw new BadRequestException("Hoá đơn không tồn tại");
    }
    await Promise.all([
      this.billTableOrderService.delete(bill.billTableOrder.id),
      this.tableFoodService.updateUseTable({
        tId: bill.billTableOrder.tableId,
        status: TableFoodStatus.FREE
      })
    ]);
    await this.billItemService.deleteByBillId(bill.id);
    await this.prisma.bill.delete({ where: { id: bill.id } });
    return true;
  }

  async update(id: number, data: UpdateBill) {
    const bill = await this.prisma.bill.findFirst({
      where: { id },
      include: {
        billTableOrder: true
      }
    });
    if (!bill) {
      throw new BadRequestException("Hoá đơn không tồn tại");
    }
    await this.tableFoodService.updateUseTable({ tId: bill.billTableOrder.tableId, status: TableFoodStatus.FREE });
    await this.billTableOrderService.delete(bill.billTableOrder.id);
    if (!bill.customerId) {
      const customer = await this.customerService.create({ name: data.name, phone: data.phone });
      await this.prisma.bill.update({
        where: { id: bill.id },
        data: {
          customerId: customer.id,
          paymentMethod: data.paymentMethod,
          paymentPrice: data.paymentPrice,
          customerPay: data.customerPay,
          giveBack: data.customerPay - data.paymentPrice,
          exportTime: new Date(),
          exportDate: data.exportDate || 0,
          status: BillStatus.CONFIRM,
          totalPrice: data.totalPrice,
          taxPay: data.taxPay
        }
      });
      return true;
    }
    await this.prisma.bill.update({
      where: { id: bill.id },
      data: {
        paymentMethod: data.paymentMethod,
        paymentPrice: data.paymentPrice,
        customerPay: data.customerPay,
        giveBack: data.customerPay - data.paymentPrice,
        exportTime: new Date(),
        status: BillStatus.CONFIRM,
        totalPrice: data.totalPrice,
        taxPay: data.taxPay
      }
    });
    return true;
  }
}
