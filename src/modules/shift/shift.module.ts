import { Module } from "@nestjs/common";
import { ShiftController } from "./shift.controller";
import { ShiftService } from "./shift.service";
import { EmployeeModule } from "../employee/employee.module";
import { HisShiftModule } from "../his-shift/his-shift.module";

@Module({
  imports: [EmployeeModule, HisShiftModule],
  controllers: [ShiftController],
  providers: [ShiftService]
})
export class ShiftModule {}
