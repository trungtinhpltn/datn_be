import { ConflictException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { plainToClass } from "class-transformer";
import { CategoryEntity } from "./entity/category.entity";
import { EditTableDto } from "../table-food/dto/edit-table-food.dto";

@Injectable()
export class MenuCategoryService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.menuCategory.findMany({
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
      this.prisma.menuCategory.findMany({
        where: {
          isDelete: false
        },
        orderBy: [
          {
            id: "asc"
          }
        ]
      }),
      this.prisma.menuCategory.count({
        where: {
          isDelete: false
        },
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
    return this.prisma.menuCategory.findFirst({
      where: {
        id,
        isDelete: false
      }
    });
  }

  async create(data: any) {
    const nameUnique = await this.prisma.menuCategory.count({
      where: {
        name: data.name
      }
    });
    if (nameUnique) {
      throw new ConflictException("Tên đã tồn tại. Vui lòng thử lại!");
    }

    const res = await this.prisma.menuCategory
      .create({
        data: {
          name: data.name,
          description: data.description
        }
      })
      .catch((error) => {
        throw error;
      });

    return plainToClass(CategoryEntity, res);
  }

  async editCategory(id: number, dto: EditTableDto) {
    const exitCategory = await this.prisma.menuCategory.count({
      where: {
        id: id
      }
    });
    if (!exitCategory) {
      throw new ConflictException("Không tồn tại loại này!");
    }

    const res = await this.prisma.menuCategory
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
    return plainToClass(CategoryEntity, res);
  }

  async delete(id: number) {
    const exitIt = this.prisma.menuCategory.count({
      where: {
        id: id
      }
    });
    if (!exitIt) {
      throw new ConflictException("Phân loại không tồn tại!");
    }
    await this.prisma.menuCategory.update({
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
