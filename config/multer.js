import multer from "multer";
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images"); //this is the folder where the images will be saved
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  }, // this is the name of the file that will be saved in the images folder
});

const multerFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    console.log("❌ Rejected file type:", file.mimetype); // Logs PDF uploads, etc.
    cb(new Error("Only image files are allowed (png, jpg, jpeg)"), false);

    // cb(null, false); //this is used to filter the files that are uploaded
  }
};

// app.use(
//   multer({ storage: multerStorage, fileFilter: multerFilter }).single("image")
// ); //this is used to upload files, like images

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
})

export default upload; // Exporting the multer instance to use in other files