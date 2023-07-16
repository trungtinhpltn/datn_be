import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { ICreateBillTableOrder } from "./dto/bill-table-order.dto";

@Injectable()
export class BillTableOrderService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.billTableOrder.findMany();
  }

  async checkTableIsUsing(tableId: number) {
    const tableIsUsing = await this.prisma.billTableOrder.findFirst({
      where: {
        tableId: tableId
      }
    });
    if (tableIsUsing) {
      return true;
    }
    return false;
  }

  async create(data: ICreateBillTableOrder) {
    return await this.prisma.billTableOrder.create({
      data: data
    });
  }

  async delete(id: number) {
    return await this.prisma.billTableOrder.delete({
      where: { id }
    });
  }
}
