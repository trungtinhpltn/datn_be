import { BadRequestException, Controller, Post, UploadedFile, UseInterceptors, UseGuards } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { AccessTokenGuard } from "../../guards";
import { defaultUploadStorage } from "../../common/utils";
import { imageFileFilter } from "../../helper/imageFileFilter";
import { CloudinaryService } from "../cloudinary/cloudinary.service";

@Controller({
  path: "/upload",
  version: "1"
})
export class UploadController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}
  @Post()
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(FileInterceptor("file"))
  // @UseInterceptors(FileInterceptor("file"))
  async upload(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException("Invalid file");
    // return {
    //   file: file.filename
    // };
    const res = await this.cloudinaryService.uploadFile(file);
    return res?.secure_url || "";
  }
}
