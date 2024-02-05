import { v2 as cloudinary } from "cloudinary";
import AppError from "./appError.js";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const uploadImageAndAddToReq = (req, res) => {
  return new Promise((resolve, reject) => {
    if (req.file === undefined) {
      console.log("No image selected to upload");
      resolve();
    } else {
      cloudinary.uploader.upload(req.file?.path, function (error, result) {
        if (error) {
          console.log(error);
          req.body.image = "";

          reject(AppError(res, "error uploading to Cloudinary", 500));
        }
        console.log("file uploaded successfully, URL:", result.url);
        req.body.image = result.url;
        resolve();
      });
    }
  });
};

export default uploadImageAndAddToReq;
