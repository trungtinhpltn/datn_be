import { Injectable, Inject, forwardRef } from "@nestjs/common";
import { EmployeeService } from "../employee/employee.service";
import { PrismaService } from "../prisma/prisma.service";
import { CreateShiftDto, GetByUserIdQuery, GetHisShiftByRestaurant } from "./dto/shift.dto";
import { HisShiftService } from "../his-shift/his-shift.service";

@Injectable()
export class ShiftService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => EmployeeService)) private employeeService: EmployeeService,
    private hisShiftService: HisShiftService
  ) {}

  async findByUserId(query: GetByUserIdQuery) {
    const { user_id } = query;
    this.createHisShift();
    return await this.prisma.shift.findFirst({
      where: {
        employeeId: user_id
      }
    });
  }

  async getHisShiftByRestaurant(query: GetHisShiftByRestaurant) {
    return await this.hisShiftService.getHisShift({
      year: query.year,
      start: query.start,
      end: query.end,
      restaurantId: query.restaurant_id
    });
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

  async createHisShift() {
    const date = new Date();
    const currentDay = date.getDay() > 0 ? date.getDay() : 7;
    const nextWeekStart = date.getDate() - currentDay + 8;
    const nextWeekFrom = new Date(date.setDate(nextWeekStart));
    const nextWeekTo = new Date(date.setDate(nextWeekStart + 6));
    const currentYear = nextWeekFrom.getFullYear();

    const check = await this.hisShiftService.checkHisShiftExit({
      year: currentYear,
      start: nextWeekFrom.toDateString(),
      end: nextWeekTo.toDateString()
    });
    if (check) {
      // const list = await this.hisShiftService.getHisShift({
      //   year: currentYear,
      //   start: nextWeekFrom,
      //   end: nextWeekTo
      // });
      // console.log("list", list);
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

  async deleteByEmpId(id: number) {
    return this.prisma.shift.deleteMany({
      where: {
        employeeId: id
      }
    });
  }
}
