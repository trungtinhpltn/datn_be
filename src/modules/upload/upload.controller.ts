import { BadRequestException, Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { defaultUploadStorage } from "src/common/utils";
import { imageFileFilter } from "src/helper/imageFileFilter";
@Controller({
  path: "/upload",
  version: "1"
})
export class UploadController {
  @Post()
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
