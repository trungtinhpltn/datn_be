import { Controller, Get, Query } from "@nestjs/common";
import { CustomerService } from "./customer.service";
import { GetCustomerQuery } from "./dto/customer.dto";

@Controller({
  path: "/customer",
  version: "1"
})
export class CustomerController {
  constructor(private customerService: CustomerService) {}
  @Get()
  getByPhone(@Query() query: GetCustomerQuery) {
    return this.customerService.findByPhone(query);
  }
}
