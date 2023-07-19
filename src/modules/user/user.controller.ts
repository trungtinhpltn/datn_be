import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { GetCurrentUser } from "../../decorators";
import { AccessTokenGuard } from "src/guards";
import RoleGuard from "src/guards/admin-role.guard";
import { EditUserDto } from "./dto";
import { CreateUserDto } from "./dto/create-user.dto";
import { GetUserDto } from "./dto/get-user.dto";
import { UserService } from "./user.service";

@Controller({
  path: "/users",
  version: "1"
})
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post("changePassword/:id")
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard)
  changePasswordUser(@Param("id") uid: number, @Body() { newPassword }: { newPassword: string }): Promise<boolean> {
    return this.userService.changePasswordUser(uid, newPassword);
  }

  @Get("me")
  @UseGuards(AccessTokenGuard)
  getMe(@GetCurrentUser("id") userId: number) {
    return this.userService.findById(userId);
  }

  @Get()
  @UseGuards(AccessTokenGuard)
  getUserList(@Query() query: GetUserDto) {
    return this.userService.getUserList(query);
  }

  @Get(":id")
  @UseGuards(AccessTokenGuard)
  getUserById(@Param("id") id: number) {
    return this.userService.findById(id);
  }

  @Put("me")
  @UseGuards(AccessTokenGuard)
  updateMe(@GetCurrentUser("id") userId: number, @Body() dto: EditUserDto) {
    return this.userService.editUser(userId, dto);
  }

  @Put(":id")
  @UseGuards(AccessTokenGuard, RoleGuard("ADMIN"))
  editUser(@Param("id") uid: number, @Body() dto: EditUserDto) {
    return this.userService.editUser(uid, dto);
  }
}
