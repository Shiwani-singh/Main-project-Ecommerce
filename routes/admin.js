import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import {getAddProduct, postAddProduct, getProducts, getEditProduct, postEditProduct, postDeleteProduct} from '../controllers/admin.js';


const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// /admin/add-product => GET
router.get('/add-product', getAddProduct);

// /admin/products => GET
router.get('/products', getProducts);

router.post('/add-product', postAddProduct);

router.get('/edit-product/:productId', getEditProduct);

router.post('/edit-product/:productId', postEditProduct);

router.post('/delete-product', postDeleteProduct);


export default router;
