import { Module } from "@nestjs/common";
import { MenuUnitController } from "./menu-unit.controller";
import { MenuUnitService } from "./menu-unit.service";

@Module({
  controllers: [MenuUnitController],
  providers: [MenuUnitService]
})
export class MenuUnitModule {}
