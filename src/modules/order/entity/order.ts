export class OrderEntity {
  id: number;
  name: string;
  phone: string;
  email: string;
  createdAt: string;
  date: string;
  time: string;
  person: number;
  children: number;
  key: string;

  constructor(partial: Partial<OrderEntity>) {
    Object.assign(this, partial);
  }
}
