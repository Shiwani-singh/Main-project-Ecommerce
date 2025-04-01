// const http = require('http');   no need of this, coz using express
import express from "express";
import ejs from "ejs";
// import bodyParser from 'body-parser'; //no need of this, coz  since Express v4.16.0+, the built-in express.urlencoded() does the same thing
import path from "path";
import { fileURLToPath } from "url";
import adminRoutes from "./routes/admin.js";
import shopRoutes from "./routes/shop.js";
import authRoutes from "./routes/auth.js";
import { errorFunction } from "./controllers/error.js";
import User from "./models/user.js";
import session from "express-session";
import connectMongoDBSession from "connect-mongodb-session";
import csrf from "csurf";
import flash from "connect-flash";
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

const MongoDBStore = connectMongoDBSession(session); // ✅ Call it with session

const port = 3000;
const app = express();

const MONGODB_URI =
  "mongodb+srv://User1:wdXsIWzdoGSB7xdS@cluster0.qalpb.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0";

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
}); //store the session in mongodb

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
    if (user) {
      req.user = user;
    }
    next();
  } catch (err) {
    console.log("Error fetching user", err);
    next();
  }
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn || false;
  res.locals.csrfToken = req.csrfToken();
  console.log("CSRF Token:", req.csrfToken());
  next();
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorFunction);

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
