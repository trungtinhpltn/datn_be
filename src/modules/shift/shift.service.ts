import { Injectable, Inject, forwardRef } from "@nestjs/common";
import { EmployeeService } from "../employee/employee.service";
import { PrismaService } from "../prisma/prisma.service";
import { CreateShiftDto, GetByUserIdQuery, GetHisShiftByRestaurant } from "./dto/shift.dto";
import { HisShiftService } from "../his-shift/his-shift.service";
import { Cron } from "@nestjs/schedule";

@Injectable()
export class ShiftService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => EmployeeService)) private employeeService: EmployeeService,
    private hisShiftService: HisShiftService
  ) {}

  async findByUserId(query: GetByUserIdQuery) {
    const { user_id } = query;
    return await this.prisma.shift.findFirst({
      where: {
        employeeId: user_id
      }
    });
  }

  async getHisShiftByRestaurant(query: GetHisShiftByRestaurant) {
    const emps = await this.employeeService.getEmployeee(query.restaurant_id);
    const res = await this.hisShiftService.getHisShift({
      year: query.year,
      start: query.start,
      end: query.end,
      restaurantId: query.restaurant_id
    });
    const data = emps?.map((item) => {
      const shift = res?.find((hs) => hs.employeeId === item?.id);
      if (shift) {
        return { ...shift, exits: true };
      }
      return {
        startDate: query.start,
        endDate: query.end,
        employeeId: item.id,
        year: query.year,
        Employee: { name: item.name },
        restaurantId: query.restaurant_id,
        exits: false
      };
    });

    return data;
  }

  async getHisShiftByEmployee(query: GetHisShiftByRestaurant) {
    return await this.hisShiftService.getHisShift({
      year: query.year,
      start: query.start,
      end: query.end,
      restaurantId: query.restaurant_id,
      employeeId: query.employee_id
    });
  }

  async create(data: CreateShiftDto) {
    const check = await this.prisma.shift.findFirst({
      where: {
        employeeId: data?.employeeId
      }
    });
    if (!check) {
      return this.prisma.shift.create({
        data: {
          ...data
        }
      });
    }
    delete data["id"];
    delete data["employeeId"];
    return this.prisma.shift.update({
      where: {
        id: check.id
      },
      data: {
        ...data
      }
    });
  }

  @Cron("* 2 * * * 0")
  async createHisShift() {
    const date = new Date();
    const num = date.getDate() - date.getDay();
    const nextWeekStart = num + 8;
    const nextWeekFrom = new Date(date.setDate(nextWeekStart));
    const nextWeekTo = new Date(date.setDate(nextWeekStart + 6));
    const currentYear = nextWeekFrom.getFullYear();
    console.log("createHisShift");

    const check = await this.hisShiftService.checkHisShiftExit({
      year: currentYear,
      start: nextWeekFrom.toDateString(),
      end: nextWeekTo.toDateString()
    });
    if (check) {
      return;
    }

    let listEmployee: any = await this.employeeService.getEmployeee();
    listEmployee = await Promise.all(
      listEmployee?.map(async (item: any) => {
        const shift = await this.prisma.shift.findFirst({
          where: {
            employeeId: item?.id
          }
        });
        return {
          ...item,
          shift
        };
      })
    );

    const data = listEmployee?.map((item: any) => ({
      employeeId: item?.id,
      startDate: nextWeekFrom.toDateString(),
      endDate: nextWeekTo.toDateString(),
      year: currentYear,
      monday: item?.shift?.moday || [],
      tuesday: item?.shift?.tuesday || [],
      wednesday: item?.shift?.wednesday || [],
      thursday: item?.shift?.thursday || [],
      friday: item?.shift?.friday || [],
      saturday: item?.shift?.saturday || [],
      sunday: item?.shift?.sunday || [],
      restaurantId: item?.restaurantId
    }));
    await this.hisShiftService.createHisShiftEmployee(data);
  }

  async updateHisShift(id: number, data: any) {
    return await this.hisShiftService.update(id, data);
  }

  async createHisShiftByEmp(data: any) {
    return await this.hisShiftService.createHisShiftEmployee([{ ...data }]);
  }

  async deleteByEmpId(id: number) {
    return this.prisma.shift.deleteMany({
      where: {
        employeeId: id
      }
    });
  }
}
