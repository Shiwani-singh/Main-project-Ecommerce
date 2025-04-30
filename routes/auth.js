import express from "express";
const router = express.Router();
import { check, body } from "express-validator";
import User from "../models/user.js";

import {
  getLogin,
  postLogin,
  postLogout,
  getSignup,
  postSignup,
  getResetPassword,
  postResetPassword,
  getNewPassword,
  postNewPassword,
} from "../controllers/authController.js";
import e from "connect-flash";

router.get("/login", getLogin);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please enter a valid email"),
    body(
      "password",
      "Please enter a password with only numbers and text and at least 5 characters and only use alphabets and numbers"
    )
      .isLength({ min: 5 })
      .isAlphanumeric(),
  ],
  postLogin
);

router.post("/logout", postLogout);

router.get("/signup", getSignup);

router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .custom(async (value, { req }) => {
        const existingUser = await User.findOne({ email: value });
        if (existingUser) {
          return Promise.reject(
            "Email already exists, please pick another one"
          );
        }
        // if (value === "test@test.com") {
        //   throw new Error("this email is forbidden");
        // }
        // return true;
      }),
    body(
      "password",
      "Please enter a password with only numbers and text and at least 5 characters and only use alphabets and numbers"
    )
      .isLength({ min: 5 })
      .isAlphanumeric()
      .custom((value) => {
        if (!/[A-Za-z]/.test(value) || !/[0-9]/.test(value)) {
          throw new Error(
            "Password must contain at least one letter and one number"
          );
        }
        return true;
      }),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords does not match! try again");
      }
      return true;
    }),
  ],
  postSignup
);

router.get("/resetPassword", getResetPassword);

router.post("/resetPassword", postResetPassword);

router.get("/resetPassword/:token", getNewPassword);

router.post("/passwordUpdate", postNewPassword);

export default router;
