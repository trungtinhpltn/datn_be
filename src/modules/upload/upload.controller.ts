import { BadRequestException, Controller, Post, UploadedFile, UseInterceptors, UseGuards } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { AccessTokenGuard } from "../../guards";
import { defaultUploadStorage } from "../../common/utils";
import { imageFileFilter } from "../../helper/imageFileFilter";

@Controller({
  path: "/upload",
  version: "1"
})
export class UploadController {
  @Post()
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(
    FileInterceptor("file", {
      storage: defaultUploadStorage,
      fileFilter: imageFileFilter
    })
  )
  // @UseInterceptors(FileInterceptor("file"))
  upload(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException("Invalid file");
    return {
      file: file.filename
    };
  }
}
