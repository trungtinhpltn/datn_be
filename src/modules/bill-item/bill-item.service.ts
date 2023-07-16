import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateBillItemDto } from "./dto/bill-item.dto";

@Injectable()
export class BillItemService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.billItem.findMany();
  }

  async getById(id: number) {
    return await this.prisma.billItem.findFirst({
      where: { id }
    });
  }

  async create(data: CreateBillItemDto) {
    const exitItem = await this.prisma.billItem.findFirst({
      where: {
        billId: data.billId,
        itemId: data.itemId
      }
    });
    if (exitItem) {
      throw new BadRequestException("Đã có món trong hóa đơn");
    }
    return await this.prisma.billItem.create({
      data: data
    });
  }

  async delete(id: number) {
    const billItem = await this.prisma.billItem.count({
      where: { id }
    });
    if (!billItem) {
      throw new BadRequestException("Món không tồn tại");
    }
    return await this.prisma.billItem.delete({
      where: { id }
    });
  }

  async deleteByBillId(bId: number) {
    return await this.prisma.billItem.deleteMany({
      where: { billId: bId }
    });
  }

  async update(id: number, data: CreateBillItemDto) {
    const exitItem = await this.prisma.billItem.count({
      where: {
        id
      }
    });
    if (!exitItem) {
      throw new BadRequestException("Món không tồn tại");
    }
    return await this.prisma.billItem.update({
      where: { id },
      data: {
        quantity: data?.quantity
      }
    });
  }
}
