import { CacheModule, MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import configuration from "./config/configuration";
import { ONE_MILION, ONE_MINUTE } from "./constants/cache";
import { AppLoggerMiddleware } from "./middleware/app-logger.middleware";
import { SignInRateLimit } from "./middleware/signin-rate-limit";
import { AuthModule } from "./modules/auth/auth.module";
import { EmployeeModule } from "./modules/employee/employee.module";
import { MenuCategoryModule } from "./modules/menu-category/menu-category.module";
import { MenuItemModule } from "./modules/menu-item/menu-item.module";
import { MenuUnitModule } from "./modules/menu-unit/menu-unit.module";
import { OrderModule } from "./modules/order/order.module";
import { PrismaModule } from "./modules/prisma/prisma.module";
import { ProvinceModule } from "./modules/province/province.module";
import { RestaurantModule } from "./modules/retaurant/restaurant.module";
import { TableFoodModule } from "./modules/table-food/table-food.module";
import { UploadModule } from "./modules/upload/upload.module";
import { BillModule } from "./modules/bill/bill.module";
import { BillTableOrderModule } from "./modules/bill-table-order/bill-table-order.module";
import { BillItemModule } from "./modules/bill-item/bill-item.module";
import { CustomerModule } from "./modules/customer/customer.module";
import { ShiftModule } from "./modules/shift/shift.module";
import { UserModule } from "./modules/user/user.module";
import { CloudinaryModule } from "./modules/cloudinary/cloudinary.module";

@Module({
  imports: [
    CacheModule.register({
      ttl: 5 * ONE_MINUTE, // seconds
      max: ONE_MILION, // records
      isGlobal: true
    }),
    AuthModule,
    ConfigModule.forRoot({
      load: [() => configuration]
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    RestaurantModule,
    ProvinceModule,
    TableFoodModule,
    MenuCategoryModule,
    MenuUnitModule,
    MenuItemModule,
    UploadModule,
    OrderModule,
    EmployeeModule,
    BillModule,
    BillTableOrderModule,
    BillItemModule,
    CustomerModule,
    ShiftModule,
    UserModule,
    CloudinaryModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddleware).forRoutes("*");
    consumer.apply(SignInRateLimit).forRoutes("v1/auth/signIn");
  }
}
