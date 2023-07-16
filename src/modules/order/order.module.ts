import { Module } from "@nestjs/common";
import { OrderController } from "./order.controller";
import { OrderService } from "./order.service";
import { MailModule } from "../mail/mail.module";
import { TableFoodModule } from "../table-food/table-food.module";

@Module({
  imports: [MailModule, TableFoodModule],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService]
})
export class OrderModule {}
