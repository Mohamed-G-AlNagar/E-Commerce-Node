import multer from "multer";
import { v4 as uuidv4 } from "uuid";

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    req.body.image = uuidv4() + "-" + file.originalname;
    cb(null, req.body.image);
  },
});

const upload = multer({ storage: storage });

export default upload;
