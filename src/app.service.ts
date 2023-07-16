import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { SeedService } from "./seeds";

@Injectable()
export class AppService implements OnApplicationBootstrap {
  getHello() {
    return {
      version: 1
      // hashVersion: child_process.execSync("git rev-parse HEAD").toString().trim()
    };
  }

  async onApplicationBootstrap() {
    new SeedService().run();
  }
}
