export class MenuUnitEntity {
  id: number;
  name: string;
  description: string;
  constructor(partial: Partial<MenuUnitEntity>) {
    Object.assign(this, partial);
  }
}
