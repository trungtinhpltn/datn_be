import { TableFoodStatus } from "../../../constants/tablefood";

export class TableFoodEnity {
  id: number;
  name: string;
  description: string;
  prePaymentAmount: number;
  restaurantId: number;
  status: TableFoodStatus;
  constructor(partial: Partial<TableFoodEnity>) {
    Object.assign(this, partial);
  }
}
