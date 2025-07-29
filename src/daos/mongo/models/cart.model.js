//  /src/daos/mongo/models/cart.model.js

import { Schema, model } from "mongoose";

// nombre de la colección
const cartCollection = "carts";

const cartSchema = new Schema({

  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  products: [
    {
      num: Number,
      title: String,
      price: Number,
      quantity: Number
    }
  ],
  total: Number,
  num: Number
}, { versionKey: false });

const cartModel = model(cartCollection, cartSchema);
export default cartModel;

