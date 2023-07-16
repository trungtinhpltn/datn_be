import { Module, forwardRef } from "@nestjs/common";
import { OrderModule } from "../order/order.module";
import { TableFoodController } from "./table-food.controller";
import { TableFoodService } from "./table-food.service";

@Module({
  imports: [forwardRef(() => OrderModule)],
  controllers: [TableFoodController],
  providers: [TableFoodService],
  exports: [TableFoodService]
})
export class TableFoodModule {}
