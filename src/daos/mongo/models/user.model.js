//  /src/daos/mongo/models/user.model.js

import { Schema, model } from "mongoose";

// nombre de la colección
const userCollection = "users";

const userSchema = new Schema({

  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  age: Number,
  email: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  password: {
    type: String,
    required: true
  },
  cart: {
    type: Schema.Types.ObjectId,
    ref: "carts"
  },
  role: {
    type: String,
    enum: ["USER", "ADMIN", "PREMIUM", "GUEST"],
    default: "USER"
  },
  num:Number
}, { versionKey: false }  )

const userModel = model(userCollection, userSchema);
export default userModel;

