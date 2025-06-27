import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

import { isAuth } from "../middleware/isAuth.js";
// import csrf from "csurf";
// import multer from "multer";
// import upload from "../config/multer.js"; // Importing the multer instance

import {
  getAddProduct,
  postAddProduct,
  getProducts,
  getEditProduct,
  postEditProduct,
  deleteProduct,
} from "../controllers/admin.js";


const router = express.Router();
import { check, body } from "express-validator";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// /admin/add-product => GET
router.get("/add-product", isAuth, getAddProduct);

// /admin/products => GET
router.get("/products", isAuth, getProducts);

router.post(
  "/add-product",
  isAuth,
  [
    body("title")
      .isString()
      .isLength({ min: 3 })
      .withMessage("Length of title must be more than 3 letters")
      .trim(),
    body("price")
      .isFloat({ gt: 0, maxDecimalPlaces: 2 })
      .withMessage("Price must be a valid number with up to 2 decimal places")
      .trim(),
    body("description")
      .isLength({ min: 5 })
      .withMessage("Description must be at least 5 characters long")
      .trim(),
  ],
  postAddProduct
);

router.get("/edit-product/:productId", isAuth, getEditProduct);

router.post(
  "/edit-product/:productId",
  isAuth,
  [
    body("title")
      .isString()
      .isLength({ min: 3 })
      .withMessage("Length of title must be more than 3 letters")
      .trim(),
    body("price")
      .isFloat({ gt: 0, maxDecimalPlaces: 2 })
      .withMessage("Price must be a valid number with up to 2 decimal places")
      .trim(),
    body("description")
      .isLength({ min: 5 })
      .withMessage("Description must be at least 5 characters long")
      .trim(),

  ],
  postEditProduct
);
// Route to serve image by filename (protected)
router.get("/private-image/:filename", isAuth, (req, res) => {
  console.log("imagepath", req.params.filename);
  const { filename } = req.params;
  const imagePath = path.join(process.cwd(), "images", filename);

  // Check if file exists
  if (!fs.existsSync(imagePath)) {
    return res.status(404).json({ error: "Image not found" });
  }

  // Optionally add auth check here before sending the file
  res.sendFile(imagePath);
});

router.delete("/product/:productId", isAuth, deleteProduct);

export default router;
