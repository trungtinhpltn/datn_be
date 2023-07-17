import { Module, forwardRef } from "@nestjs/common";
import { EmployeeService } from "./employee.service";
import { EmployeeController } from "./employee.controller";
import { UserModule } from "../user/user.module";
import { ShiftModule } from "../shift/shift.module";
import { HisShiftModule } from "../his-shift/his-shift.module";
// , forwardRef(() => ShiftModule)
@Module({
  imports: [UserModule, forwardRef(() => ShiftModule), HisShiftModule],
  controllers: [EmployeeController],
  providers: [EmployeeService],
  exports: [EmployeeService]
})
export class EmployeeModule {}
