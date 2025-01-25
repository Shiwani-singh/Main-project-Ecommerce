import { Sequelize } from "sequelize";
import sequelize from '../util/database.js';

export const CartItem = sequelize.define('cartItem', {
  id:{
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  quantity: {
    type: Sequelize.INTEGER,
  }
});