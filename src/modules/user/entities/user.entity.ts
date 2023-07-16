import { Exclude } from "class-transformer";

export class UserEntity {
  id: number;
  name: string;
  username: string;
  email: string;
  phoneNumber: string;
  role: string;
  teamId?: number;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;

  @Exclude()
  password: string;
  hashedRt: string;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
