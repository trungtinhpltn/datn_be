import { BadRequestException, Inject, Injectable, forwardRef } from "@nestjs/common";
import { takeSkipOrderByConvert } from "src/common/utils";
import { POSITION_ROLE } from "src/constants/employee";
import { HisShiftService } from "../his-shift/his-shift.service";
import { PrismaService } from "../prisma/prisma.service";
import { ShiftService } from "../shift/shift.service";
import { UserService } from "../user/user.service";
import { CreateEmployeeDto } from "./dto/create-employee.dto";
import { UpdateEmployeeDto } from "./dto/update-employee.dto";
import { QueryEmployeeParams } from "./employee.controller";

@Injectable()
export class EmployeeService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    @Inject(forwardRef(() => ShiftService)) private shiftService: ShiftService,
    private hisShiftService: HisShiftService
  ) {
    //log
  }

  async create(createEmployeeDto: CreateEmployeeDto) {
    return await this.prisma.$transaction(async (prismaTransaction) => {
      const newUser = await this.userService.create(
        {
          name: createEmployeeDto.name || createEmployeeDto.email,
          username: createEmployeeDto.email,
          email: createEmployeeDto.email,
          password: createEmployeeDto.password,
          role: POSITION_ROLE[createEmployeeDto?.position] || "user"
        },
        { prismaTransaction }
      );
      return prismaTransaction.employee.create({
        data: {
          userId: newUser.id,
          name: createEmployeeDto.name,
          phone: createEmployeeDto.phone,
          dateOfBirth: createEmployeeDto.dateOfBirth,
          placeOfBirth: createEmployeeDto.placeOfBirth,
          nation: createEmployeeDto.nation,
          from: createEmployeeDto.from,
          idNumber: createEmployeeDto.idNumber,
          learn: createEmployeeDto.learn,
          address: createEmployeeDto.address,
          provinceId: createEmployeeDto.provinceId ? +createEmployeeDto.provinceId : undefined,
          districtId: createEmployeeDto.districtId ? +createEmployeeDto.districtId : undefined,
          image: createEmployeeDto.image,
          restaurantId: createEmployeeDto.restaurantId ? +createEmployeeDto.restaurantId : undefined,
          position: createEmployeeDto.position,
          active: !!createEmployeeDto.active,
          email: createEmployeeDto.email,
          type: createEmployeeDto.type,
          dateContract: createEmployeeDto.dateContract,
          wawe: createEmployeeDto.wawe ? +createEmployeeDto.wawe : undefined,
          trialTime: createEmployeeDto.trialTime ? +createEmployeeDto.trialTime : undefined
        }
      });
    });
  }

  async findAll({ page, size, sort, q, position, restaurant_id }: QueryEmployeeParams) {
    const { skip, take, orderBy } = takeSkipOrderByConvert({ page, size, sort });
    const where = {};

    if (q) {
      where["OR"] = [{ name: { contains: q } }, { phone: { contains: q } }, { email: { contains: q } }];
    }
    if (position) {
      where["position"] = position;
    }

    const data = await this.prisma.employee.findMany({
      include: { Restaurant: true },
      where: {
        ...where,
        restaurantId: restaurant_id
      },
      skip,
      take,
      orderBy
    });
    const total = await this.prisma.employee.count({
      where: {
        ...where,
        restaurantId: restaurant_id
      }
    });
    return { data, total };
  }

  async getEmployeee() {
    return await this.prisma.employee.findMany({
      where: {
        active: true
      },
      select: {
        id: true,
        restaurantId: true
      },
      orderBy: {
        id: "asc"
      }
    });
  }

  findOne(id: number) {
    return this.prisma.employee.findFirst({ where: { id }, include: { Restaurant: true } });
  }

  async update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    const check = await this.prisma.employee.findFirst({
      where: { id }
    });
    if (!check) {
      throw new BadRequestException("Nhân viên không tồn tại");
    }
    await this.userService.editUser(check.userId, {
      role: POSITION_ROLE?.[updateEmployeeDto?.position] || "user"
    });
    return this.prisma.employee.update({
      where: { id },
      data: {
        name: updateEmployeeDto.name,
        phone: updateEmployeeDto.phone,
        dateOfBirth: updateEmployeeDto.dateOfBirth,
        placeOfBirth: updateEmployeeDto.placeOfBirth,
        nation: updateEmployeeDto.nation,
        from: updateEmployeeDto.from,
        idNumber: updateEmployeeDto.idNumber,
        learn: updateEmployeeDto.learn,
        address: updateEmployeeDto.address,
        provinceId: updateEmployeeDto.provinceId ? +updateEmployeeDto.provinceId : undefined,
        districtId: updateEmployeeDto.districtId ? +updateEmployeeDto.districtId : undefined,
        image: updateEmployeeDto.image,
        position: updateEmployeeDto.position,
        active: !!updateEmployeeDto.active,
        email: updateEmployeeDto.email,
        type: updateEmployeeDto.type,
        dateContract: updateEmployeeDto.dateContract,
        wawe: updateEmployeeDto.wawe ? +updateEmployeeDto.wawe : undefined,
        trialTime: updateEmployeeDto.trialTime ? +updateEmployeeDto.trialTime : undefined
      }
    });
  }

  async remove(id: number) {
    const emp = await this.prisma.employee.findFirst({ where: { id } });
    if (!emp) {
      throw new BadRequestException("Nhân viên không tồn tại");
    }
    await Promise.all([this.userService.deleteUser(emp.userId), this.shiftService.deleteByEmpId(emp.id)]);
    await this.hisShiftService.deleteByEmp(emp.id);
    return this.prisma.employee.delete({ where: { id } });
  }
}
