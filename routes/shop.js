import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from "fs";

import {isAuth} from '../middleware/isAuth.js';
import { getIndex, getProducts, getProductById, postCart, getCart, postCartDeleteItem, getOrders, postOrder, getTest} from '../controllers/shop.js';


const router = express.Router();

// Define __dirname manually for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get('/test-session', getTest);

router.get('/', getIndex);

router.get('/products', getProducts)

router.get('/products/:productId', getProductById);

router.get('/cart', isAuth, getCart);

router.post('/cart', isAuth, postCart);

router.post('/cart-delete-item', isAuth, postCartDeleteItem);

router.get('/orders', isAuth, getOrders)

router.post('/create-order', isAuth, postOrder) 

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




// router.get('/', (req, res, next) => {
//     console.log('Welcome to the home page');
//     // res.sendFile(path.join(rootDir, 'views' , 'shop.html'));   //dirname is a global variable which simply hold the absolute path on our operatig system to this (current) project folder and second segment 'views' to go the folder and last segment'shop.js' that is the file which we want to send.
//     res.render('shop', {prods: products, pageTitle: 'Shop', path: '/'});
//     // console.log('rootdir', rootDir);
//     // // next();
// });

export default router;