import { ConflictException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { plainToClass } from "class-transformer";
import { EditTableDto } from "../table-food/dto/edit-table-food.dto";
import { MenuUnitEntity } from "./entity/menu-unit";

@Injectable()
export class MenuUnitService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.menuUnit.findMany({
      where: {
        isDelete: false
      },
      orderBy: [
        {
          id: "asc"
        }
      ]
    });
  }

  async findByQuery() {
    const [data, total] = await Promise.all([
      this.prisma.menuUnit.findMany({
        where: {
          isDelete: false
        },
        orderBy: [
          {
            id: "asc"
          }
        ]
      }),
      this.prisma.menuUnit.count({
        orderBy: [
          {
            id: "asc"
          }
        ]
      })
    ]);
    return {
      data,
      total
    };
  }

  async findById(id: number) {
    return this.prisma.menuUnit.findFirst({
      where: {
        id,
        isDelete: false
      }
    });
  }

  async create(data: any) {
    const nameUnique = await this.prisma.menuUnit.count({
      where: {
        name: data.name
      }
    });
    if (nameUnique) {
      throw new ConflictException("Tên đã tồn tại. Vui lòng thử lại!");
    }

    const res = await this.prisma.menuUnit
      .create({
        data: {
          name: data.name,
          description: data.description
        }
      })
      .catch((error) => {
        throw error;
      });

    return plainToClass(MenuUnitEntity, res);
  }

  async editCategory(id: number, dto: EditTableDto) {
    const exitCategory = await this.prisma.menuUnit.count({
      where: {
        id: id
      }
    });
    if (!exitCategory) {
      throw new ConflictException("Không tồn tại loại này!");
    }

    const res = await this.prisma.menuUnit
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
    return plainToClass(MenuUnitEntity, res);
  }

  async delete(id: number) {
    const exitIt = this.prisma.menuUnit.count({
      where: {
        id: id
      }
    });
    if (!exitIt) {
      throw new ConflictException("Phân loại đơn vị tính không tồn tại!");
    }
    await this.prisma.menuUnit.update({
      where: {
        id
      },
      data: {
        isDelete: true
      }
    });

    return true;
  }
}
