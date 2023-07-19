import { ConflictException, Injectable } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { sortQueryToObject } from "src/common/utils";
import { PrismaService } from "../prisma/prisma.service";
import { EditRestaurantDto } from "./dto";
import { CreateRestaurantDto } from "./dto/create-restaurant.dto";
import { GetRestaurantQuery } from "./dto/get-restaurant.dto";
import { RestaurantEntity } from "./entities/restaurant.entity";

@Injectable()
export class RestaurantService {
  constructor(private prisma: PrismaService) {}

  async find() {
    const conditionSort: any = [
      {
        createdAt: "desc"
      }
    ];
    const data = await this.prisma.restaurant.findMany({
      where: {
        isDelete: false
      },
      orderBy: conditionSort
    });
    return data;
  }

  async findByQuery(query: GetRestaurantQuery) {
    const { page, size, q, sort, active } = query;
    const skip = (page - 1) * size;

    const condition: any = {};
    if (q) {
      condition["name"] = {
        contains: q
      };
    }

    if (active === "true" || active === "false") {
      condition["active"] = {
        equals: active === "true" ? true : false
      };
    }

    const conditionSort: any = [{ createdAt: "asc" }];
    const data = await this.prisma.restaurant.findMany({
      where: {
        ...condition,
        isDelete: false
      },
      orderBy: [...conditionSort],
      skip,
      take: +size,
      include: {
        Province: true,
        District: true
      }
    });
    const total = await this.prisma.restaurant.count({
      where: {
        ...condition,
        isDelete: false
      }
    });

    return {
      total,
      data
    };
  }

  async findById(id: number) {
    return await this.prisma.restaurant.findFirst({
      where: {
        id
      },
      include: {
        Province: true,
        District: true
      }
    });
  }

  async create(createRestaurantDto: CreateRestaurantDto) {
    const nameUnique = await this.prisma.restaurant.count({
      where: {
        name: createRestaurantDto.name,
        provinceId: createRestaurantDto.provinceId,
        districtId: createRestaurantDto.districtId
      }
    });
    if (nameUnique) {
      throw new ConflictException("Tên nhà hàng đã tồn tại. Vui lòng thử lại!");
    }

    const res = await this.prisma.restaurant
      .create({
        data: {
          name: createRestaurantDto?.name,
          addressDetail: createRestaurantDto?.addressDetail,
          provinceId: createRestaurantDto?.provinceId,
          districtId: createRestaurantDto?.districtId
        }
      })
      .catch((error) => {
        throw error;
      });

    return plainToClass(RestaurantEntity, res);
  }

  async editRestaurant(rid: number, dto: EditRestaurantDto) {
    const existRestaurant = await this.prisma.restaurant.count({
      where: {
        id: rid
      }
    });
    if (!existRestaurant) {
      throw new ConflictException("Nhà hàng không tồn tại!");
    }

    const res = await this.prisma.restaurant
      .update({
        where: {
          id: rid
        },
        data: {
          ...dto
        }
      })
      .catch((error) => {
        throw error;
      });
    return plainToClass(RestaurantEntity, res);
  }
}
