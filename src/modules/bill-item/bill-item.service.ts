import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateBillItemDto, GetReportQuery } from "./dto/bill-item.dto";

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

  async getReport(query: GetReportQuery) {
    const { from, to, restaurant_id } = query;
    const res = await this.prisma.billItem.findMany({
      where: {
        AND: [
          {
            timeCreated: {
              gte: from
            }
          },
          {
            timeCreated: {
              lte: to
            }
          }
        ],
        restaurantId: restaurant_id
      },
      include: {
        MenuItem: true
      }
    });
    let data: any = {};
    res.forEach((item) => {
      if (data?.[item.itemId]) {
        data[item.itemId] = {
          ...data?.[item?.itemId],
          quantity: data?.[item.itemId]?.quantity + item.quantity
        };
        return;
      }
      data[item?.itemId] = {
        id: item?.itemId,
        name: item?.MenuItem?.name,
        quantity: item?.quantity
      };
    });
    data = Object.keys(data)?.map((key) => ({ ...data?.[key] })) || [];
    data.sort((a: any, b: any) => b.quantity - a.quantity);
    return data?.slice(0, 10);
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
