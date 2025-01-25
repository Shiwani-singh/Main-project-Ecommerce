// // import db from './util/database.js';
// import db from "../util/database.js";

// import { Cart } from "./cart.js";

// // Helper function to read products from file   // we do not need helper function anymore coz will work with database
// // const getProductsFromFile = (cb) => {
// //   fs.readFile(filePath, (err, fileContent) => {
// //     if (err || !fileContent) {
// //       return cb([]); // Return an empty array if file doesn't exist or is empty
// //     } else {
// //       cb(JSON.parse(fileContent.toString() || "[]"));
// //     }
// //   });
// // };

// export class Product {
//   constructor(id, title, imageUrl, description, price) {
//     this.id = id;
//     this.title = title;
//     this.imageUrl = imageUrl;
//     this.description = description;
//     this.price = price;
//   }

//   save() {
//     return db.execute(
//       'INSERT INTO products (title, price, imageUrl, description) VALUES (?, ?, ?, ?)', [this.title, this.price, this.imageUrl, this.description]
//     );
      
//     //we do not need this anymore coz we are gonna work with database now.
//     // getProductsFromFile((products) => {
//     //   if(this.id) { // If the product already exists  (i.e. we are editing)
//     //     const existingProductIndex = products.findIndex(prod => prod.id === this.id);
//     //     const updatedProducts = [...products]; // Copy the existing products array
//     //     updatedProducts[existingProductIndex] = this; // Update the product at the existing index
//     //     fs.writeFile(filePath, JSON.stringify(updatedProducts), (err) => {
//     //       if (err) {
//     //         console.log("Error saving product:", err);
//     //       } else {
//     //         console.log("Product Saved");
//     //       }
//     //     });
//     //   } else {
//     //     this.id = Math.random().toString();
//     //     products.push(this); // Add the current product to the array
//     //     fs.writeFile(filePath, JSON.stringify(products), (err) => {
//     //     if (err) {
//     //       console.log("Error saving product:", err);
//     //     } else {
//     //       console.log("Product Saved");
//     //     }
//     //   });
//     //   }
//     // });
//   }

//   static deleteById(id) {
//     // getProductsFromFile(products => {
//     //   const product = products.find(p => p.id === id);
//     //   const updatedProducts = products.filter(p => p.id !== id);
//     //   fs.writeFile(filePath, JSON.stringify(updatedProducts), err => {
//     //     if(!err) {
//     //       Cart.deleteProduct(id, product.price);
//     //     }
//     //   });
//     // });
//   }

//   static fetchAll() {
//     //we do not cb as parameter anymore coz we will use promise
//     // getProductsFromFile(cb); //// Simply use the helper function to fetch all products
//     return db.execute("SELECT * FROM products");
//   }

//   static findById(id) {
//     // console.log(id);
//     return db.query('SELECT * FROM products WHERE products.id = ?', [id]);
//     ////we do not cb as parameter anymore coz we will use promise
//     // getProductsFromFile(products => {
//     //   const product = products.find(p => p.id === id);
//     //   cb(product);
//     // });
//   }
// }

// // made a helper function getProductsFromFile because readFile of save and fetchAll function doing the same thing so this make clean and shorter

// work with sequelize
import { Sequelize } from "sequelize";
import sequelize from '../util/database.js';
export const Product = sequelize.define('product', {
  id:{
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  title:{
    type: Sequelize.STRING,
    allowNull: false
  },
  price:{
    type: Sequelize.DOUBLE,
    allowNull: false
  },
  imageUrl:{
    type: Sequelize.STRING,
    allowNull: false
  },
  description:{
    type: Sequelize.STRING,
    allowNull: false
  }
})