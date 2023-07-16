import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { GetCustomerQuery, ICreateCustomer } from "./dto/customer.dto";

@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService) {}

  async findByPhone(query: GetCustomerQuery) {
    const { phone } = query;
    return await this.prisma.customer.findFirst({
      where: {
        phone
      }
    });
  }

  async create(data: ICreateCustomer) {
    const exitCustomer = await this.prisma.customer.findFirst({
      where: {
        name: data.name,
        phone: data.phone
      }
    });
    if (exitCustomer) {
      return exitCustomer;
    }
    return await this.prisma.customer.create({
      data: data
    });
  }
}
