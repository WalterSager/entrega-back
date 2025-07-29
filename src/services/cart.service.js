//  /src/services/cart.service.js

import { Types, model } from "mongoose";
import CartRepository from "../repositories/cart.repository.js";
import UserRepository from "../repositories/user.repository.js";
import ProductRepository from "../repositories/product.repository.js";
import { getNextNumber } from "../daos/mongo/utils/getNextNumber.js";
import { checkStock } from "../utils/stockChecker.js";



const cartRepo = new CartRepository();
const userRepo = new UserRepository();
const productRepo = new ProductRepository();

class CartService {

  async createCart(uid, productNumbers = []) {
    // 1. Buscar usuario
    const user = await userRepo.getById(uid);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }
    // 2. Buscar productos usando productRepo
    const products = await productRepo.getByNumbersArray(productNumbers);
    if (!products || products.length === 0) {
      throw new Error("Productos no encontrados");
    }
    // 2.1 Validar stock para cada producto (cantidad = 1 por defecto)
    for (const prod of products) {
      const hasStock = await checkStock(prod.num, 1);
      if (!hasStock) {
        throw new Error(`Producto ${prod.title} sin stock disponible`);
      }
    }
    // 3. Construir productos del carrito (con cantidad 1)
    const cartProducts = this.makeCartContent(products);
    // 4. Calcular total
    const total = this.calculateCartTotal(cartProducts);
    const number = await getNextNumber(cartRepo.model);
    // 5. Armar el carrito
    const cart = {
      products: cartProducts,
      total,
      num: number
    };
    // 6. Guardar carrito
    const savedCart = await cartRepo.create(cart);
    // 7. Opcional: vincular carrito al usuario
    await userRepo.updateById(uid, { cart: savedCart._id });
    return savedCart;
  }

  async createEmptyCart(uid) {
    // 1. Verificar existencia de usuario
    const user = await userRepo.getById(uid);
    if (!user) throw new Error("Usuario no encontrado");

    // 2. Crear carrito vacío
    const number = await getNextNumber(cartRepo.model);
    const cart = {
      user: uid,  // ← IMPORTANTE: pasar solo el ID, no el objeto entero
      products: [],
      total: 0,
      num: number
    };

    const savedCart = await cartRepo.create(cart);

    // 3. Asociar carrito al usuario
    await userRepo.updateById(uid, { cart: savedCart._id });

    return savedCart;
  }



  async getAllCarts() {
    return await cartRepo.getAll();
  }

  async getCartById(cartID) {
    return await cartRepo.getById(cartID);
  }

  async updateCart(cartID, updateData) {
    if (!cartID || typeof updateData !== "object") {
      throw new Error("Parámetros inválidos para actualizar el carrito");
    }
    const updatedCart = await cartRepo.updateById(cartID, updateData);
    if (!updatedCart || updatedCart.modifiedCount === 0) {
      throw new Error("No se pudo actualizar el carrito");
    }
    return updatedCart;
  }

  async addProductToCart(cartID, productData) {
    const cart = await cartRepo.getById(cartID);
    if (!cart) throw new Error("Carrito no encontrado");

    // Obtener producto desde BD para verificar stock
    const qtyToAdd = productData.quantity || 1;
    const existingProduct = cart.products.find(p => p.num === productData.num);
    const newQuantity = existingProduct ? existingProduct.quantity + qtyToAdd : qtyToAdd;

    const hasStock = await checkStock(productData.num, newQuantity);
    if (!hasStock) {
      throw new Error(`Stock insuficiente para el producto ${productData.title}`);
    }
    if (existingProduct) {
      existingProduct.quantity = newQuantity;
    } else {
      cart.products.push({
        num: productData.num,
        title: productData.title,
        price: productData.price,
        quantity: qtyToAdd
      });
    }

    cart.total = this.calculateCartTotal(cart.products);
    const updated = await cartRepo.updateById(cartID, cart);

    return updated;
  }

  async addProductById(cartId, productId) {
    try {
      const cartID = new Types.ObjectId(String(cartId));
      const productID = new Types.ObjectId(String(productId));
  
      // 1. Obtener el carrito
      const cart = await cartRepo.getById(cartID);
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }
  
      // 2. Obtener el producto
      const product = await productRepo.getById(productID);
      if (!product) {
        throw new Error("Producto no encontrado");
      }
  
      const qtyToAdd = 1;
  
      // 3. Buscar si el producto ya está en el carrito
      const existingProduct = cart.products.find(p => Number(p.num) === Number(product.num));
      
      const newQuantity = existingProduct
        ? existingProduct.quantity + qtyToAdd
        : qtyToAdd;
  
      // 4. Verificar stock
      const hasStock = await checkStock(product.num, newQuantity);
      if (!hasStock) {
        throw new Error(`Stock insuficiente para el producto ${product.title}`);
      }
  
      // 5. Agregar o actualizar producto en el carrito
      if (existingProduct) {
        existingProduct.quantity = newQuantity;
      } else {
        cart.products.push({
          num: product.num,
          title: product.title,
          price: product.price,
          quantity: qtyToAdd
        });
      }
  
      // 6. Recalcular total
      cart.total = this.calculateCartTotal(cart.products);
  
      // 7. Guardar cambios
      const updated = await cartRepo.updateById(cartID, cart);
  
      return updated;
    } catch (error) {
      console.error("❌ Error en addProductById:", error.message);
      throw error; // para que lo capture el controller y devuelva respuesta al cliente
    }
  }
  


  async updateProductQuantity(cartID, productNum, newQty) {
    const cart = await cartRepo.getById(cartID);
    if (!cart) throw new Error("Carrito no encontrado");

    const product = cart.products.find(p => p.num === productNum);
    if (!product) throw new Error("Producto no encontrado en el carrito");

    if (newQty <= 0) {
      // Eliminar el producto si la cantidad es 0 o menos
      cart.products = cart.products.filter(p => p.num !== productNum);
    } else {
      // Validar stock antes de actualizar cantidad
      const hasStock = await checkStock(productNum, newQty);
      if (!hasStock) {
        throw new Error(`Stock insuficiente para el producto con num ${productNum}`);
      }
      product.quantity = newQty;
    }

    cart.total = this.calculateCartTotal(cart.products);
    const updated = await cartRepo.updateById(cartID, cart);

    return updated;
  }

  async removeProductFromCart(cartID, productNum) {
    const cart = await cartRepo.getById(cartID);
    if (!cart) throw new Error("Carrito no encontrado");

    const originalLength = cart.products.length;

    cart.products = cart.products.filter(p => p.num !== productNum);
    if (cart.products.length === originalLength) {
      throw new Error("Producto no encontrado en el carrito");
    }

    cart.total = this.calculateCartTotal(cart.products);
    const updatedCart = await cartRepo.updateById(cartID, cart);

    return updatedCart;
  }

  async deleteCart(cartID) {
    if (!cartID) throw new Error("Se requiere un ID de carrito válido");

    const result = await cartRepo.deleteById(cartID);
    if (!result || result.deletedCount === 0) {
      throw new Error("No se encontró el carrito o no se pudo eliminar");
    }

    return { status: "success", message: "Carrito eliminado correctamente" };
  }

  makeCartContent(products) {
    return products.map(prod => ({
      num: prod.num,
      title: prod.title,
      price: prod.price,
      quantity: 1
    }));
  }

  calculateCartTotal(cartProducts) {
    return cartProducts.reduce((acc, p) => acc + p.price * p.quantity, 0);
  }

}

export default CartService;
