import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
  },
});

userSchema.methods.addToCart = function (product) {
  const cartProductIndex = this.cart.items.findIndex((cartProduct) => {
    return cartProduct.productId.toString() === product._id.toString();
  }); //If a match is found, findIndex() returns the index (position) of the product in the array. If no match is found, it returns -1.

  let newQuantity = 1;
  const updatedCartItems = [...this.cart.items];

  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({
      productId: product._id,
      quantity: newQuantity,
    });
  }
  const updatedCart = { items: updatedCartItems };
  this.cart = updatedCart;
  return this.save()
};

userSchema.methods.removeFromCart = function (productId) {
  const updatedCartItems = this.cart.items.filter((item) => {
    return item.productId.toString() !== productId.toString();
  });

  this.cart.items = updatedCartItems;
  return this.save();
}

userSchema.methods.clearCart = function(){
  this.cart = { items: [] }
  return this.save();
}

export default mongoose.model("User", userSchema);




/*import { Sequelize , DataTypes } from "sequelize";
import sequelize from "../util/database.js";


export const User = sequelize.define('user', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    }
}); */

/*import mongodb from "mongodb";
import { ObjectId } from "mongodb";
import { getDb } from "../util/database.js";
import { name } from "ejs";

export class User {
  constructor(userName, email, cart, id) {
    this.userName = userName;
    this.email = email;
    this.cart = cart; // {items: []} an object with items array, can have multiple items
    this._id = id;
  }

  save() {
    const db = getdb();
    return db
      .collection("users")
      .insertOne(this)
      .then((reuslt) => {
        console.log(result, "user saved");
      })
      .catch((err) => {
        console.log(err, "error saving user");
        throw err;
      });
  }

  addToCart(product) {
    const cartProductIndex = this.cart.items.findIndex((cartProduct) => {
      return cartProduct.productId.toString() === product._id.toString();
    }); //If a match is found, findIndex() returns the index (position) of the product in the array. If no match is found, it returns -1.

    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        productId: new mongodb.BSON.ObjectId(product._id),
        quantity: newQuantity,
      });
    }
    const updatedCart = { items: updatedCartItems };

    const db = getDb();
    return db
      .collection("users")
      .updateOne(
        { _id: new mongodb.BSON.ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      );
  }

  getCart() {
    const db = getDb();
    const productIds = this.cart.items.map((i) => {
      return i.productId;
    });
    return db
      .collection("products")
      .find({ _id: { $in: productIds } })
      .toArray()
      .then((products) => {
        return products.map((p) => {
          return {
            ...p,
            quantity: this.cart.items.find((i) => {
              return i.productId.toString() === p._id.toString();
            }).quantity,
          };
        });
      })
      .catch((err) => {
        console.log(err, "error getting cart");
        throw err;
      });
  }

  deleteItemFromCart(productId) {
    const updatedCartItems = this.cart.items.filter((item) => {
      return item.productId.toString() !== productId.toString();
    });
    const db = getDb();
    return db
      .collection("users")
      .updateOne(
        { _id: new mongodb.BSON.ObjectId(this._id) },
        { $set: { cart: { items: updatedCartItems } } }
      );
  }

  addOrder() {
    const db = getDb();
    return this.getCart() fetches the cart items, returning them as a promise.s
      .then((products) => {
        const order = {
          items: products,
          user: { _id: new mongodb.BSON.ObjectId(this._id), name: this.userName },
        };
        return db
        .collection("orders")
        .insertOne(order);
      })
      .then((result) => {
        this.cart = { items: [] }; //emplty my cart after order is placed
        return db
          .collection("users")
          .updateOne(
            { _id: new mongodb.BSON.ObjectId(this._id) },
            { $set: { cart: { items: [] } } }
          );
      });
  }

  getOrders() {
    const db = getDb();
    return db
      .collection("orders")
      .find({ "user._id": new mongodb.BSON.ObjectId(this._id) })
      .toArray();
  }

  static findById(userId) {
    const db = getDb();
    return db
      .collection("users")
      .findOne({ _id: new mongodb.BSON.ObjectId(userId) })
      .then((user) => {
        console.log(user, "user found");
        return user;
      })
      .catch((err) => {
        console.log(err, "error finding user");
        throw err;
      });
  }
} */
