import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import {isAuth } from '../middleware/isAuth.js';
import {getAddProduct, postAddProduct, getProducts, getEditProduct, postEditProduct, postDeleteProduct} from '../controllers/admin.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// /admin/add-product => GET
router.get('/add-product', isAuth, getAddProduct);

// /admin/products => GET
router.get('/products', isAuth, getProducts);

router.post('/add-product', isAuth,  postAddProduct);

router.get('/edit-product/:productId', isAuth, getEditProduct);

router.post('/edit-product/:productId',isAuth,  postEditProduct);

router.post('/delete-product', isAuth, postDeleteProduct);


export default router;
