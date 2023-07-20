import { v2 as cloudinary } from "cloudinary";

export const CloudinaryProvider = {
  provide: "CLOUDINARY",
  useFactory: () => {
    return cloudinary.config({
      cloud_name: "dx3hfbt8j",
      api_key: "127976618592521",
      api_secret: "ePFz23cVLUzlDp8m-QktvIGtICs"
    });
  }
};
