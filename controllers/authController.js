// export const getLogin = (req, res, next) => {  code from udemy, which does worked

//   const isLoggedIn = req.get("Cookie").split("=")[1] === "true";
//   console.log(isLoggedIn
//     ? "User is logged in"
//     : "User is not logged in"
//   )
//   res.render("auth/login", {
//     path: "/login",
//     pageTitle: "Login Page",
//     isAuthenticated: isLoggedIn,
//   });
// };

import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodeMailer from "nodemailer";
import User from "../models/user.js";

const transporter = nodeMailer.createTransport({
  service: "gmail",
  auth: {
    user: "1ecommerce.project@gmail.com",
    pass: "dvsn odah vpfr xtiu",
  },
});

export const getLogin = (req, res, next) => {
  const cookieHeader = req.get("Cookie"); //fetches the cookies from the request headers. Cookies are stored in a header called "Cookie".
  let isLoggedIn = false; // We assume that the user is not logged in by default.

  if (cookieHeader) {
    //This checks if cookies are present in the request.
    const cookies = cookieHeader.split(";").map((cookie) => cookie.trim()); // Trim spaces
    const authCookie = cookies.find((cookie) => cookie.startsWith("loggedIn=")); // Find correct cookie

    if (authCookie) {
      isLoggedIn = authCookie.split("=")[1] === "true";
    }
  }

  console.log(
    isLoggedIn
      ? "User is logged in from getLogin"
      : "User is not logged in from getLogin"
  );
  let message = req.flash("error");
  // console.log("Retrieved Flash Message:", message); // Debugging

  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  // console.log(req.flash("message"));
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login Page",
    errorMessage: message,
  });
};

export const postLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      // console.log("Invalid email or password.");
      req.flash("error", "User did not found, Please sign up.");
      return res.redirect("/login");
    }
    const passwordMatched = await bcrypt.compare(password, user.password);
    if (passwordMatched) {
      req.flash("error", "Incorrect password. Please try again.");
      req.session.isLoggedIn = true;
      req.session.user = user; //mongoose method
      return req.session.save((err) => {
        //This is a callback function that will be executed once the session has been saved.
        console.log("Session Saved:", err);
        res.redirect("/");
      });
    } else {
      req.flash("error", "Incorrect password. Please try again.");
      res.redirect("/login");
    }
  } catch (err) {
    console.log(err, "error fetching user");
    req.flash("error", "Something went wrong, please try again.");
    return res.redirect("/login");
  }
};

// export const postLogin = (req, res, next) => {
//   // res.setHeader("Set-Cookie", "loggedIn=true");
//   User.findById("67bc8e27f958c663bf3a6627")
//     .then((user) => {
//       //created user manually coz not using authentication for now
//       // req.user = new User(user.name, user.email, user.cart, user._id); Storeing user in requests so can use the information, like name or email, when the user create products
//       req.session.isLoggedIn = true;
//       req.session.user = user; //mongoose method
//       req.session.save((err) => {
//         //This is a callback function that will be executed once the session has been saved.
//         console.log(err); //for debugging
//         res.redirect("/");
//       });
//     })
//     .catch((err) => {
//       console.log("error fetching user", err);
//     });
// };

export const postLogout = (req, res, next) => {
  // console.log("User logged out from post logout");
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
      return res.send("Error logging out");
    }
    console.log("User logged out from post logout");
    res.redirect("/login");
  });
};

export const getSignup = (req, res, next) => {
  let message = req.flash("error");
  // console.log("Retrieved Flash Message:", message); // Debugging

  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup Page",
    errorMessage: message,
  });
};

export const postSignup = async (req, res, next) => {
  try {
    const { email, password, confirmPassword } = req.body;

    if (!password) {
      req.flash("error", "Password is required");
      return res.redirect("/signup");
    }

    if (password !== confirmPassword) {
      req.flash("error", "Passwords do not match");
      return res.redirect("/signup");
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      req.flash(
        "error",
        "A user with this email address already exists. Try logging in."
      );
      return res.redirect("/signup"); // Stop execution if user exists
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create and save the new user
    const user = new User({
      email: email,
      password: hashedPassword,
      cart: { items: [] },
    });

    await user.save();
    try {
      await transporter.sendMail({
        to: email,
        from: "1ecommerce.project@gmail.com",
        subject: "Signup succeeded!",
        html: "<h1>You successfully signed up!</h1>",
      });
    } catch (mailErr) {
      console.error("Error sending email:", mailErr);
      req.flash("error", "User registered but email not sent.");
    }
    res.redirect("/login"); // Redirect to login after successful signup
  } catch (err) {
    console.error("Error during signup:", err);
    req.flash("error", "Something went wrong. Please try again.");
    res.redirect("/signup");
    next(err); // Pass error to Express error handler
  }
};

export const getResetPassword = (req, res, next) => {
  let message = req.flash("error");
  // console.log("Retrieved Flash Message:", message); // Debugging

  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/resetPassword", {
    path: "/resetPassword",
    pageTitle: "resetPassword Page",
    errorMessage: message,
  });
};

export const postResetPassword = async (req, res, next) => {
  try {
    const email = req.body.email;
    const buffer = await new Promise((resolve, reject) => {
      crypto.randomBytes(32, (err, buf) => {
        if (err) {
          reject(err);
          console.log(err);
          res.redirect("/resetPassword");
          req.flash("error", "Error generating token for reset password");
        } else resolve(buf);
      });
    });
    const token = buffer.toString("hex"); // this token should stored in the database for the user.
    const user = await User.findOne({ email: email });

    if (!user) {
      req.flash("error", "No account with this email found, Please Signup.");
      return res.redirect("/resetPassword");
    }
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    await transporter.sendMail({
      to: email,
      from: "1ecommerce.project@gmail.com",
      subject: "Password Reset Request!",
      html: `<h1>You requested a password reset</h1>
          <p>Click this <a href="http://localhost:3000/resetPassword/${token}">link</a> to set a new password.</p>
          `,
    });
    res.redirect("/login");
  } catch (err) {
    console.log(err);
    req.flash("error", "Error processing password reset request.");
    res.redirect("/resetPassword");
  }
};

export const getNewPassword = async (req, res, next) => {
  try {
    const token = req.params.token;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    let message = req.flash("error");
    message = message.length > 0 ? message[0] : null;

    res.render("auth/passwordUpdate", {
      path: "/passwordUpdate",
      pageTitle: "resetPassword-Page",
      errorMessage: message,
      userId: user?._id.toString(),
      passwordToken: token,
    });
  } catch (err) {
    console.log(err);
  }
};

export const postNewPassword = async (req, res, next) => {
  const {newPassword, passwordToken, userId} = req.body;
  try{
    const user = await User.findOne({_id: userId, resetPasswordToken: passwordToken, resetPasswordExpires: {$gt: Date.now()}});
    // console.log(user, "user found");
    if(!user){
      req.flash("error", "User not found or token expired.");
      return res.redirect("/login");
    }
    const  hashedUpdatedPassword = await bcrypt.hash(newPassword, 12);
    console.log(hashedUpdatedPassword, "hashedUpdatedPassword");
    user.password = hashedUpdatedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.redirect("/login");
  } catch(err){
    console.log(err);
  }
}

// export const postSignup = (req, res, next) => {
//   //want to store the user in the database
//   const email = req.body.email;
//   const password = req.body.password;
//   const confirmPassword = req.body.confirmPassword;
//   if (!password) {
//     return res.status(400).json({ error: "Password is required" });
//   }
//   User.findOne({ email: email }) //mongoose method , left side is the key in the database and right side is the value we are looking for
//     .then((userDoc) => {
//       if (userDoc) {
//         // req.flash(
//         //   "error",
//         //   "A user with this email address already exists. Try logging in."
//         // );
//         return res.redirect("/signup"); // User already exists
//       }
//       return bcrypt
//         .hash(password, 12) //hashing the password
//         .then((hashedPassword) => {
//           const user = new User({
//             email: email,
//             password: hashedPassword,
//             cart: { items: [] },
//           });
//           return user.save();
//         })
//         .then((result) => {
//           res.redirect("/login");
//         });
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };
