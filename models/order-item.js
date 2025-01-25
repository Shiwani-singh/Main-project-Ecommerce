import { Sequelize } from "sequelize";
import sequelize from '../util/database.js';

export const orderItem = sequelize.define('orderItem', {
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