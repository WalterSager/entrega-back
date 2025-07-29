//  /src/daos/mongo/models/product.model.js

import { Schema, model } from "mongoose";

// nombre de la colección
const productCollection = "products";

const productSchema =  new Schema({ 
    title:String,
    description:String,
    code_bar:String,   
    price:Number,
    status:Boolean,
    stock:Number,
    category:String,
    thumbnails:[String],
    num: { 
      type: Number, 
      required: true, 
      unique: true }
  }, { versionKey: false }); 

export const productModel = model(productCollection, productSchema);