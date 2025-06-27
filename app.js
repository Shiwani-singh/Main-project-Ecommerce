// const http = require('http');   no need of this, coz using express
import express from "express";

import ejs from "ejs";
// import bodyParser from 'body-parser'; //no need of this, coz  since Express v4.16.0+, the built-in express.urlencoded() does the same thing
import path from "path";
import { fileURLToPath } from "url";
import adminRoutes from "./routes/admin.js";
import shopRoutes from "./routes/shop.js";
import authRoutes from "./routes/auth.js";
import { errorFunction, errorFunction500 } from "./controllers/error.js";
import User from "./models/user.js";
import session from "express-session";
import connectMongoDBSession from "connect-mongodb-session";
import csrf from "csurf";
import flash from "connect-flash";
import multer from "multer";
// import sequelize from "./util/database.js";
// import { Product } from "./models/product.js";
// import {User} from "./models/user.js";
// import { Cart} from "./models/cart.js";
// import { CartItem } from "./models/cart-item.js";
// import {Order} from "./models/order.js";
// import { orderItem } from "./models/order-item.js";
// import { constants } from "buffer";
// import {mongoConnection , getDb}from "./util/database.js";
import mongoose from "mongoose";
import { error } from "console";

const MongoDBStore = connectMongoDBSession(session); // ✅ Call it with session

const port = 3000;
const app = express();

const MONGODB_URI =
  "mongodb+srv://User1:wdXsIWzdoGSB7xdS@cluster0.qalpb.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0";

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
}); //store the session in mongodb

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images"); //this is the folder where the images will be saved
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
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

app.use(multer({
  storage: multerStorage,
  fileFilter: multerFilter,
}).single("image"))// Exporting the multer instance to use in other files

const csrfProtection = csrf();



app.set("view engine", "ejs");
app.set("views", "views");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  session({
    secret: "secretKey",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
); //session middleware
app.use(express.urlencoded({ extended: false }));


app.use(express.static(path.join(__dirname, "public")));
app.use(csrfProtection);

app.use(flash());

app.use((req, res, next) => {
  console.log( 'request body',req.body)
  res.locals.isAuthenticated = req.session.isLoggedIn || false;
  res.locals.csrfToken = req.csrfToken();
  // console.log("CSRF Token:", req.csrfToken());
  next();
});

// to use the user in the app anywhere
// want to make sure that every time a request comes in (e.g., someone visiting your online shop), you can access the user easily.
// This is done by adding a middleware function. Middleware is like a checkpoint before your request is processed.
/*app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      //created user manually coz not using authentication for now
      // req.user = new User(user.name, user.email, user.cart, user._id); Storeing user in requests so can use the information, like name or email, when the user create products
      req.user = user; //creating an user based on the user data stored in the session
      next();
    })
    .catch((err) => {
      console.log("error fetching user", err);
    });
});*/

app.use(async (req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  try {
    const user = await User.findById(req.session.user._id);
    if (!user) {
      // If no user found (maybe deleted), move to next without setting req.user
      return next();
    }
    req.user = user; // Attach found user to request object
    next();
  } catch (err) {
    console.log("Error fetching user", err);
    // res.redirect("/500");
    next(err);
  }
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

// app.get("/500", errorFunction500); //error page
app.use(errorFunction);

app.use(errorFunction500);

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    // User.findOne().then((user) => {
    //   if (!user) {
    //     const user = new User({
    //       name: "shivani",
    //       email: "test@gmail.com",
    //       cart: {
    //         items: [],
    //       },
    //     });
    //     user.save();
    //   }
    // });
    app.listen(port, () => {
      console.log(`Server is running on ${port}`);
    });
  })
  .catch((err) => {
    console.log("error connecting to mongodb", err);
  });

// mongoConnection( () => {
//   app.listen(port, () => {
//     console.log(`Server is running on ${port}`);
//   });
// })

/*Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" }); //A user created this product
User.hasMany(Product); //A user has many products
User.hasOne(Cart); //A user can have one cart
Cart.belongsTo(User); //reverse relation which is optional, A cart belomgs to a user
Cart.belongsToMany(Product, {through: CartItem});  //cart belongs to many products 
Product.belongsToMany(Cart, { through: CartItem }); //reverse relaion, a product belongs to many cart
Order.belongsTo(User);
User.hasMany(Order); 
Order.belongsToMany(Product, { through: orderItem});


sequelize
   //.sync({ force: true})  //it will overwrite the table everytime when we start the server
   .sync()
  .then((result) => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      return User.create({
        firstName: "shivani",
        lastName: "singh",
        email: "test@gmail.com",
      });
    }
    return user;
  })
  .then((user) => {
    // console.log(user);
    return user.createCart();
  })
  .then(cart => app.listen(port, () => {
    console.log(`Server is running on ${port}`);
  }))
  .catch((err) => {
    console.log("Error in creating table", err);
  });*/
