import { Module } from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { TableFoodModule } from "../table-food/table-food.module";

@Module({
  imports: [TableFoodModule],
  providers: [TasksService]
})
export class TasksModule {}
