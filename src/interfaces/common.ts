import { Prisma } from "@prisma/client";

export interface IOptionCommon {
  prismaTransaction?: Prisma.TransactionClient;
}
