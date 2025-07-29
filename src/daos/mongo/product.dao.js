//  /src/daos/mongo/product.dao.js


import { productModel } from "./models/product.model.js";

class ProductDAO {

  async createProduct(product) {
    try {
      const newProduct = await productModel.create(product);
      return newProduct;
    } catch (error) {
      console.error({ error });
      return null;
    }
  }

  get model() {
    return productModel;
  }
  
  async getProducts(filter = {}) {
    try {
      const products = await productModel.find(filter);
      return products;
    } catch (error) {
      console.error({ error });
      return null;
    }
  }

  async getProductById(pid) {
    try {
      // Asegura que sea un string
      const product = await productModel.findById(String(pid));     
      
      return product;
    } catch (error) {
      console.error({ error });
      return null;
    }
  }
  async getProductByNum(num) {
    try {
      const product = await productModel.findOne({ num });
      return product;
    } catch (error) {
      console.error({ error });
      return null;
    }
  }
//getProductsByProductNumbers
  async getProductsByProductNumbers(numbersArray) {
    return await productModel.find({ num: { $in: numbersArray } });
  }

 

  async updateProduct(pid, data) {
    try {
      const updated = await productModel.updateOne({ _id: pid }, { $set: data });
      return updated;
    } catch (error) {
      console.error({ error });
      return null;
    }
  }

  async deleteProductByID(pid) {
    try {
      const result = await productModel.deleteOne({ _id: pid });
      return result;
    } catch (error) {
      console.error({ error });
      return null;
    }
  }

  async deleteProductByNum(num) {
    try {
      const result = await productModel.deleteOne({ num });
      return result;
    } catch (error) {
      console.error({ error });
      return null;
    }
  }

}

export default ProductDAO;