import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const uploadImageAndAddToReq = (req, res, next) => {
  if (req.file === undefined) {
    console.log("No file to upload");
    return next();
  }
  cloudinary.uploader.upload(req.file.path, function (error, result) {
    if (error) {
      console.log(error);
      res.json({ message: "error uploading to Cloudinary" });
    }
    console.log("file uploaded successfully, URL:", result.url);
    req.body.image = result.url;
    next();
  });
};

export default uploadImageAndAddToReq;
