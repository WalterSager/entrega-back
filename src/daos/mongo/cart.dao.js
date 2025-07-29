//  /src/daos/mongo/cart.dao.js

import cartModel from "./models/cart.model.js";

class CartDAO {
  
  async saveCart(cart) {
    try {
      let result = await cartModel.create(cart);
      return result;
    } catch (error) {
      console.error({ error });
      return null;
    }
  }

  get model() {
    return cartModel;
  }
  
  async getCarts() {
    try {
      let result = await cartModel.find({});
      return result;
    } catch (error) {
      console.error({ error });
      return null;
    }
  }

  async getCartById(cartID) {
    try {
      let result = await cartModel.findOne({ _id: cartID });
      return result;
    } catch (error) {
      console.error({ error });
      return null;
    }
  }

  async getCartByNum(cartNumber) {
    try {
      let result = await cartModel.findOne({ _id: cartNumber });
      return result;
    } catch (error) {
      console.error({ error });
      return null;
    }
  }
  async updateCart(cartID, obj) {
    try {
      let result = await cartModel.updateOne({ _id: cartID }, { $set: obj });
      return result;
    } catch (error) {
      console.error({ error });
      return null;
    }
  }
  async deleteCart(cartID) {
    try {
      const result = await cartModel.deleteOne({ _id: cartID });
      return result;
    } catch (error) {
      console.error({ error });
      return null;
    }
  }
  

}

export default CartDAO;