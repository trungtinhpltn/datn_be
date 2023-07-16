import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Logger, ValidationPipe, VersioningType } from "@nestjs/common";
import configuration from "./config/configuration";
import { TransformInterceptor } from "./interceptors/interceptor.transform-response";
import { HttpExceptionFilter } from "./filters/http-exception.filter";
import { PrismaService } from "./modules/prisma/prisma.service";
import * as bodyParser from "body-parser";

const logger = new Logger("NestApplication");

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.enableVersioning({
    type: VersioningType.URI
  });
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      transformOptions: { enableImplicitConversion: true }
    })
  );

  app.use(bodyParser.json({ limit: "100mb" }));
  app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));

  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);
  // app.enableCors({
  //   origin: ["*", "http://localhost:3000", "http://127.0.0.1:5173", "http://localhost:5173", "/localhost/, /ftech/"]
  //   // methods: ["GET", "POST"],
  //   // credentials: true
  // });

  await app.listen(configuration.port);
}

bootstrap().then(() => logger.log(`Server running on port ${configuration.port}`));
