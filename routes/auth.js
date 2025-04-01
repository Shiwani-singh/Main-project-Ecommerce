import express from 'express';
const router = express.Router();

import { getLogin, postLogin, postLogout, getSignup, postSignup, getResetPassword, postResetPassword, getNewPassword, postNewPassword } from '../controllers/authController.js';

router.get('/login', getLogin);

router.post('/login', postLogin);

router.post('/logout',postLogout);

router.get('/signup', getSignup);

router.post('/signup', postSignup);

router.get('/resetPassword', getResetPassword);

router.post('/resetPassword', postResetPassword);

router.get('/resetPassword/:token', getNewPassword);

router.post('/passwordUpdate', postNewPassword);

export default router;