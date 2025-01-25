import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import { getIndex, getProducts, getProductById, getCart, postCart, postCartDeleteItem, getOrders, postOrder} from '../controllers/shop.js';

const router = express.Router();

// Define __dirname manually for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get('/', getIndex);

router.get('/products', getProducts)

router.get('/products/:productId', getProductById);

router.get('/cart', getCart);

router.post('/cart', postCart);

router.post('/cart-delete-item' , postCartDeleteItem);

router.get('/orders', getOrders)

router.post('/create-order' , postOrder)





// router.get('/', (req, res, next) => {
//     console.log('Welcome to the home page');
//     // res.sendFile(path.join(rootDir, 'views' , 'shop.html'));   //dirname is a global variable which simply hold the absolute path on our operatig system to this (current) project folder and second segment 'views' to go the folder and last segment'shop.js' that is the file which we want to send.
//     res.render('shop', {prods: products, pageTitle: 'Shop', path: '/'});
//     // console.log('rootdir', rootDir);
//     // // next();
// });

export default router;