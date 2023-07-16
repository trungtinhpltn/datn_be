export class CreateEmployeeDto {
  email: string;
  password: string;

  name?: string;
  phone?: string;
  dateOfBirth?: Date;
  placeOfBirth?: string;
  nation?: string;
  from?: string;
  idNumber?: string;
  learn?: string;
  address?: string;
  provinceId?: number;
  districtId?: number;
  restaurantId?: number;
  position?: string;
  active?: boolean;
  type?: string;
  dateContract?: Date;
  wawe?: number;
  trialTime?: number;
  image?: string;
}
