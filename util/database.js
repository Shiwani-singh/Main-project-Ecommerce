// using sequelize
/*import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME, 
  process.env.DB_USER, 
  process.env.DB_PASSWORD, 
  {
    dialect: process.env.DB_DIALECT,
    host: process.env.DB_HOST,
  }
);

export default sequelize;*/

import mongodb from "mongodb";
import { MongoClient } from "mongodb";


let _db;
const mongoConnection = callback => {
  MongoClient.connect(
    'mongodb+srv://User1:wdXsIWzdoGSB7xdS@cluster0.qalpb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
  )
    .then((client) => {
      console.log("connected");
      _db = client.db(); // Store database connection
      callback();
    })
    .catch((err) => {
      console.log("error conecting to mongodb", err);
      throw err;
    });
};
const getDb = () => {
  if (_db) {
    return _db; // Return the existing database connection
  }
  throw "No database found";
};

export { mongoConnection, getDb };
