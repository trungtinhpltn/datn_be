import { BadRequestException, ConflictException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateMenuItemDto } from "./dto/create-menu-item.dto";
import { plainToClass } from "class-transformer";
import { MenuItemEntity } from "./entity/menu-item.entity";
import { GetMenuItemQuery } from "./dto/get-menu-item.dto";

@Injectable()
export class MenuItemService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const [data, total] = await Promise.all([this.prisma.menuItem.findMany({}), this.prisma.menuItem.count({})]);
    return { data, total };
  }

  async findAllByRestaurant(rId: number) {
    return await this.prisma.menuItem.findMany({
      where: { restaurantId: rId, isDelete: false },
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

  async findByQuery(query: GetMenuItemQuery) {
    const { page, size, q, restaurant_id } = query;
    const skip = (page - 1) * size;

    const conditions: any = {
      isDelete: false
    };
    if (q) {
      conditions["name"] = {
        contains: q
      };
    }
    if (restaurant_id) {
      conditions["restaurantId"] = restaurant_id;
    }
    const [data, total] = await Promise.all([
      this.prisma.menuItem.findMany({
        where: conditions,
        skip,
        take: +size,
        include: {
          Category: true,
          MenuUnit: true
        },
        orderBy: [
          {
            id: "asc"
          },
          {
            name: "asc"
          }
        ]
      }),
      this.prisma.menuItem.count({
        where: conditions
      })
    ]);
    return {
      data,
      total
    };
  }

  async findById(id: number, query: GetMenuItemQuery) {
    const { restaurant_id } = query;
    const conditions: any = {
      isDelete: false
    };
    if (restaurant_id) {
      conditions["restaurantId"] = restaurant_id;
    }
    return await this.prisma.menuItem.findFirst({
      where: { ...conditions, id: id },
      include: {
        Category: true,
        MenuUnit: true
      }
    });
  }

  async create(data: CreateMenuItemDto) {
    const nameUnique = await this.prisma.menuItem.count({
      where: {
        name: data.name,
        restaurantId: data.restaurantId
      }
    });
    if (nameUnique) {
      throw new ConflictException("Tên món đã tồn tại!");
    }

    const [exitCat, exitUnit] = await Promise.all([
      this.prisma.menuCategory.count({ where: { id: data?.categoryId } }),
      this.prisma.menuUnit.count({ where: { id: data?.unitId } })
    ]);

    if (!exitCat) {
      throw new BadRequestException("Không tồn tại phân loại!");
    }
    if (!exitUnit) {
      throw new BadRequestException("Không tồn tại đơn vị này!");
    }
    const res = await this.prisma.menuItem
      .create({
        data: {
          name: data.name,
          description: data.description,
          image: data.image,
          price: data.price,
          discountPrice: data.discountPrice,
          unitId: data.unitId,
          categoryId: data.categoryId,
          restaurantId: data.restaurantId
        }
      })
      .catch((error) => {
        throw error;
      });

    return plainToClass(MenuItemEntity, res);
  }

  async update(id: number, data: CreateMenuItemDto) {
    const exitIt = this.prisma.menuItem.count({
      where: {
        id: id,
        restaurantId: data?.restaurantId
      }
    });
    if (!exitIt) {
      throw new ConflictException("Món ăn không tồn tại!");
    }

    const res = await this.prisma.menuItem
      .update({
        where: {
          id: id
        },
        data: data
      })
      .catch((error) => {
        throw error;
      });
    return plainToClass(MenuItemEntity, res);
  }

  async delete(id: number) {
    const exitIt = this.prisma.menuItem.count({
      where: {
        id: id
      }
    });
    if (!exitIt) {
      throw new ConflictException("Món ăn không tồn tại!");
    }
    await this.prisma.menuItem.update({
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
