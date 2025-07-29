//  /src/daos/mongo/models/ticket.model.js

import { Schema, model } from "mongoose";

// nombre de la colección
const ticketCollection = "tickets";

const ticketSchema = new Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  purchase_datetime: {
    type: Date,
    default: Date.now
  },
  amount: {
    type: Number,
    required: true
  },
  purchaser: {
    type: String, // email del usuario
    required: true
  },
  products: [
    {
      num: Number,
      title: String,
      price: Number,
      quantity: Number
    }
  ]
});

const ticketModel = model(ticketCollection, ticketSchema);

export default ticketModel;
