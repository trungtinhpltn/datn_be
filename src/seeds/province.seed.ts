import { Injectable } from "@nestjs/common";
import { ProvinceType } from "@prisma/client";
import { PrismaService } from "src/modules/prisma/prisma.service";
import { BaseSeed } from "./common/base.seed";
import DistrictData from "./data/district.json";
import ProvinceData from "./data/province.json";
import VillageData from "./data/village.json";

@Injectable()
export class ProvinceSeed extends BaseSeed {
  constructor(protected prisma: PrismaService) {
    super(prisma);
  }

  async checkRun(): Promise<boolean> {
    const [province, district] = await Promise.all([
      this.prisma.province.findFirst({
        where: {
          type: "TINH"
        }
      }),
      this.prisma.province.findFirst({
        where: {
          type: "HUYEN"
        }
      }),
      this.prisma.province.findFirst({
        where: {
          type: "XA"
        }
      })
    ]);
    if (!province) return true;
    return false;
  }

  async importSeed(): Promise<void> {
    await this.prisma.province.createMany({
      data: ProvinceData?.data?.map((item) => ({
        code: item?.MaDVHC + "",
        name: item?.Ten,
        type: ProvinceType[item?.Cap]
      }))
    });
    const pros = await this.prisma.province.findMany({ where: { type: "TINH" } });

    await Promise.all(
      pros.slice(0, 30)?.map((pro) => {
        return this.prisma.province.createMany({
          data: DistrictData?.data
            ?.filter((it) => it?.CapTren === +(pro?.code + ""))
            ?.map((dis) => ({
              code: dis?.MaDVHC + "",
              name: dis?.Ten,
              type: ProvinceType[dis?.Cap],
              parentId: pro?.id
            }))
        });
      })
    );

    pros?.length >= 30 &&
      (await Promise.all(
        pros.slice(30, pros?.length)?.map((pro) => {
          return this.prisma.province.createMany({
            data: DistrictData?.data
              ?.filter((it) => it?.CapTren === +(pro?.code + ""))
              ?.map((dis) => ({
                code: dis?.MaDVHC + "",
                name: dis?.Ten,
                type: ProvinceType[dis?.Cap],
                parentId: pro?.id
              }))
          });
        })
      ));

    const dists = await this.prisma.province.findMany({ where: { type: "HUYEN" } });

    let time = Math.round(dists.length / 10);
    let start = 1;
    do {
      await Promise.all(
        dists.slice((start - 1) * 10, start * 10)?.map((dis) => {
          return this.prisma.province.createMany({
            data: VillageData?.data
              ?.filter((it) => it?.CapTren === +(dis?.code + ""))
              ?.map((vill) => ({
                code: vill?.MaDVHC + "",
                name: vill?.Ten,
                type: ProvinceType[vill?.Cap],
                parentId: dis.id
              }))
          });
        })
      );
      await new Promise((resolve) => setTimeout(() => resolve(1), 1500));
      time--;
      start++;
    } while (time > 0);

    // ProvinceData?.data?.forEach(async (item) => {
    //   const pro = await this.prisma.province.findFirst({
    //     where: {
    //       type: `TINH`,
    //       code: item?.MaDVHC + ""
    //     }
    //   });
    //   await Promise.all(
    //     DistrictData?.data
    //       ?.filter((it) => it?.CapTren === item?.MaDVHC)
    //       ?.map((dis) => {
    //         return this.prisma.province.create({
    //           data: {
    //             code: dis?.MaDVHC + "",
    //             name: dis?.Ten,
    //             type: ProvinceType[dis?.Cap],
    //             parentId: pro?.id,
    //             children: {
    //               create: VillageData?.data
    //                 ?.filter((it) => it?.CapTren === dis?.MaDVHC)
    //                 ?.map((vill) => ({
    //                   code: vill?.MaDVHC + "",
    //                   name: vill?.Ten,
    //                   type: ProvinceType[vill?.Cap]
    //                 }))
    //             }
    //           }
    //         });
    //       })
    //   );
    // });
  }
}
