import { Module } from "@nestjs/common";
import { HisShiftService } from "./his-shift.service";

@Module({
  providers: [HisShiftService],
  exports: [HisShiftService]
})
export class HisShiftModule {}
