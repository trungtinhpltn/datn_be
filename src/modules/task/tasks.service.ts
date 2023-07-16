import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { TableFoodService } from "../table-food/table-food.service";

@Injectable()
export class TasksService {
  constructor(private tableFoodService: TableFoodService) {}
  @Cron("* 30 * * * *")
  handleCron() {
    this.tableFoodService.updateTableOrder();
  }

  //   @Interval(10000)
  //   handleInterval() {
  //     this.logger.debug("Called every 10 seconds");
  //   }

  //   @Timeout(5000)
  //   handleTimeout() {
  //     this.logger.debug("Called once after 5 seconds");
  //   }
}
