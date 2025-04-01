import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const orderSchema = new Schema({
  products: [
    {
      product: { type: Object, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  
  user: {
    email: {
      type: String,
      require: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      require: true
    },
    
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.model('Order', orderSchema);





/*import { Sequelize } from "sequelize";
import sequelize from '../util/database.js';

export const Order = sequelize.define('order', {
  id:{
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  }
}); */