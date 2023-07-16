import { Injectable } from "@nestjs/common";
import * as argon from "argon2";
import { PrismaService } from "src/modules/prisma/prisma.service";
import { BaseSeed } from "./common/base.seed";
import UserAdminDatas from "./data/user-admin.json";

@Injectable()
export class UserAdminSeed extends BaseSeed {
  constructor(protected prisma: PrismaService) {
    super(prisma);
  }

  async checkRun(): Promise<boolean> {
    return (
      (await this.prisma.user.count({
        where: {
          OR: [
            {
              role: "ADMIN"
            },
            {
              username: "admin"
            }
          ]
        }
      })) === 0
    );
  }

  async importSeed(): Promise<void> {
    const hash = await argon.hash(UserAdminDatas.password);
    await this.prisma.user.create({
      data: { ...UserAdminDatas, password: hash, role: "ADMIN" }
    });
  }
}
