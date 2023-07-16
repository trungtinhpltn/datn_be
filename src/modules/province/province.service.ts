import { Injectable } from "@nestjs/common";
import { ProvinceType } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ProvinceService {
  private listProvince;
  constructor(private prisma: PrismaService) {
    //log
  }

  async findAll() {
    if (this.listProvince) return this.listProvince;
    const data = await this.prisma.province.findMany();
    this.listProvince = data;
    return data;
  }

  async findAllByParentId(parentId: number) {
    return await this.prisma.province.findMany({
      where: {
        parentId: parentId
      }
    });
  }

  async findAllByType(type: ProvinceType) {
    return await this.prisma.province.findMany({
      where: {
        type
      }
    });
  }
}
