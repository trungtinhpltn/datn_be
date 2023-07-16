import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { User } from "./entitis/user.entity";

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendConfirmation(user: User) {
    await this.mailerService.sendMail({
      to: user.email,
      subject: "MTFood - Yêu cầu đặt bàn",
      template: "./confirmation",
      context: {
        name: user.name,
        url: `http://localhost:3000/${user.key}`
      }
    });
  }

  async sendCancelOrder(user: User) {
    await this.mailerService.sendMail({
      to: user.email,
      subject: "MTFood - Hủy yêu cầu đặt bàn",
      template: "./cancelorder",
      context: {
        name: user.name,
        msg: user.msg
      }
    });
  }

  async sendConfirmOrder(user: User) {
    await this.mailerService.sendMail({
      to: user.email,
      subject: "MTFood - Xác nhận yêu cầu đặt bàn",
      template: "./confirmorder",
      context: {
        name: user.name,
        url: `http://localhost:3000/${user.key}`
      }
    });
  }
}
