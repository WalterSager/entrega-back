//  /src/repositories/cart.repository.js

import CartDAO from "../daos/mongo/cart.dao.js";

const cartDAO = new CartDAO();

class CartRepository {
  
  create(cart) {
    return cartDAO.saveCart(cart);
  }

  get model() {
    return cartDAO.model;
  }
  
  getAll() {
    return cartDAO.getCarts();
  }

  getById(cid) {
    return cartDAO.getCartById(cid);
  }  

  getByNum(num) {
    return cartDAO.getCartByNum(num);
  }

  updateById(id, data) {
    return cartDAO.updateCart(id, data);
  }

  deleteById(cid) {
    return cartDAO.deleteCart(cid);
  }

  addProduct(cid, pid, quantity) {
    return cartDAO.addProductToCart(cid, pid, quantity);
  }

  removeProduct(cid, pid) {
    return cartDAO.removeProductFromCart(cid, pid);
  }

  clearCart(cid) {
    return cartDAO.clearCart(cid);
  }
}

export default CartRepository;
