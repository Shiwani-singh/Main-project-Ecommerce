/*import fs from "fs";
import path from "path";
import rootDir from "../util/path.js";
import { error } from "console";

const filePath = path.join(rootDir, "Data", "cart.json");

export class Cart {
  static addProduct(id, productPrice) {
    fs.readFile(filePath, (error, fileContent) => {
      // Initialize Cart
      let Cart = { products: [], totalPrice: 0 };

      // Parse existing cart if no error
      if (!error) {
        Cart = JSON.parse(fileContent); // Converts the file content to a JavaScript object
      }

      // Analyze the cart => Find existing product
      const existingProductIndex = Cart.products.findIndex(
        (prod) => prod.id === id
      );
      const existingProduct = Cart.products[existingProductIndex];
      let updatedProduct;

      // Add new product or increase quantity
      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.qty = updatedProduct.qty + 1;
        Cart.products = [...Cart.products];
        Cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id: id, qty: 1 };
        Cart.products = [...Cart.products, updatedProduct];
      }

      // Update total price
      Cart.totalPrice = Cart.totalPrice + +productPrice;

      // Write updated cart back to the file
      fs.writeFile(filePath, JSON.stringify(Cart), (error) => {
        if (error) {
          console.log("Error writing to file:", error);
        }
      });
    });
  }

  static deleteProduct(id, productPrice) {
    fs.readFile(filePath, (error, fileContent) => {
      if (error) {
        return;
      }
      const updatedCart = { ...JSON.parse(fileContent) };
      const product = updatedCart.products.find((prod) => prod.id === id);
      if (!product) { //if the given product is part of the cart
        console.log("Product not found in cart.");
        return;
      }
      const productQty = product.qty;
      updatedCart.products = updatedCart.products.filter(
        (prod) => prod.id !== id
      );
      updatedCart.totalPrice =
        updatedCart.totalPrice - productPrice * productQty;

      fs.writeFile(filePath, JSON.stringify(updatedCart), (error) => {
        if (error) {
          console.log("Error writing to file:", error);
        }
      });
    });
  }

  static getCart(cb) {
    fs.readFile(filePath, (error, fileContent) => {    //fileContent - Contains the contents of the file if reading is successful.
      const cart = JSON.parse(fileContent);  //fileContent is the file's raw data (in text format). If the file contains JSON data, this line converts it into a JavaScript object using JSON.parse().
      if (error) {
        cb(null);  //the callback (cb) is called with null, meaning "no cart data available."
      } else {
        cb(cart); // Send the cart data back via the callback
      }
    });
  }
}
  const existingProduct = cart.products.find(prod => prod.id === id) = > This is a better way to find the product in the cart.
 cb - This is a callback function. The lecturer is using it to send the cart data back after reading it. Think of cb as a messenger that delivers data to wherever you want.
*/

// Working with sequelize
/*import { Sequelize } from "sequelize";
import sequelize from '../util/database.js';

export const Cart = sequelize.define('cart', {
  id:{
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  }
});*/

