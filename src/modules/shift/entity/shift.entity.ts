export class MenuItemEntity {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  discountPrice: number;
  unitId: number;
  categoryId: number;
  restaurantId: number;

  constructor(partial: Partial<MenuItemEntity>) {
    Object.assign(this, partial);
  }
}
