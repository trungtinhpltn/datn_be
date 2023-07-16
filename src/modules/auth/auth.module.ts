import { Module } from "@nestjs/common";
import { AuthControllerV1 } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PrismaModule } from "../prisma/prisma.module";
import { JwtModule } from "@nestjs/jwt";
import { AccessStrategy, RefreshTokenStrategy } from "./strategies";

@Module({
  imports: [PrismaModule, JwtModule.register({})],
  controllers: [AuthControllerV1],
  providers: [AuthService, AccessStrategy, RefreshTokenStrategy]
})
export class AuthModule {}
