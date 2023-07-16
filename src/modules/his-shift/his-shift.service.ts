import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateHisShift } from "./dto/his-shift.dto";

@Injectable()
export class HisShiftService {
  constructor(private prisma: PrismaService) {}

  async checkHisShiftExit({ year, start, end }: { year: number; start: string; end: string }) {
    return this.prisma.historyShift.findFirst({
      where: {
        year: year,
        startDate: {
          equals: start
        },
        endDate: {
          equals: end
        }
      }
    });
  }

  async createHisShiftEmployee(data: CreateHisShift[]) {
    return this.prisma.historyShift.createMany({ data: data });
  }

  async getHisShift({
    year,
    start,
    end,
    restaurantId,
    employeeId
  }: {
    year: number;
    start: string;
    end: string;
    restaurantId: number;
    employeeId?: number;
  }) {
    const conditions: any = {};
    if (restaurantId) {
      conditions["restaurantId"] = restaurantId;
    }
    if (employeeId) {
      conditions["employeeId"] = employeeId;
    }
    return this.prisma.historyShift.findMany({
      where: {
        year: year,
        startDate: {
          equals: start
        },
        endDate: {
          equals: end
        },
        ...conditions
      },
      include: {
        Employee: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        id: "asc"
      }
    });
  }

  async update(id: number, data: CreateHisShift) {
    return this.prisma.historyShift.update({
      where: { id },
      data: data
    });
  }
}
