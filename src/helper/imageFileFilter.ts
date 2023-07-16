export const imageFileFilter = (req: any, file: any, callback: any) => {
  if (!file.originalname.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/)) {
    req.fileValidationError = "only image files allowed";
    return callback(null, false);
  }
  callback(null, true);
};
