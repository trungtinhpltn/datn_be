export class RestaurantEntity {
  id: number;
  name: string;
  addressDetail: string;
  proviceId: number;
  districtId: number;

  constructor(partial: Partial<RestaurantEntity>) {
    Object.assign(this, partial);
  }
}
