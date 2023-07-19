import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards, UseInterceptors } from "@nestjs/common";

import { GetCurrentUser } from "../../decorators";
import { AccessTokenGuard, RefeshTokenGuard } from "src/guards";
import RoleGuard from "src/guards/admin-role.guard";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";
import { Tokens } from "./types";

@Controller({
  path: "/auth",
  version: "1"
})
export class AuthControllerV1 {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post("signIn")
  signIn(@Body() auth: AuthDto) {
    return this.authService.signIn(auth);
  }

  @Post("signOut")
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  logout(@GetCurrentUser("id") userId: number): Promise<boolean> {
    return this.authService.logout(userId);
  }

  @Post("changePassword")
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard, RoleGuard(["ADMIN", "USER"]))
  changePassword(
    @GetCurrentUser("id") userId: number,
    @Body() { newPassword }: { newPassword: string }
  ): Promise<boolean> {
    return this.authService.changePassword(userId, newPassword);
  }

  @UseGuards(RefeshTokenGuard)
  @Post("refresh")
  @UseGuards(AccessTokenGuard, RoleGuard(["ADMIN", "USER"]))
  @HttpCode(HttpStatus.OK)
  refreshTokens(
    @GetCurrentUser("id") userId: number,
    @GetCurrentUser("refreshToken") refreshToken: string
  ): Promise<Tokens> {
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
