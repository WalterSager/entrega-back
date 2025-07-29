//    /src/utils/stockChecker.js

import ProductRepository from "../repositories/product.repository.js";

const productRepo = new ProductRepository();

/**
 * Verifica si hay stock suficiente para un producto dado un número y cantidad deseada.
 * @param {number} productNum - Número identificador del producto.
 * @param {number} quantity - Cantidad requerida.
 * @returns {Promise<boolean>} - true si hay stock suficiente, false si no.
 * @throws Error si el producto no existe.
 */
export async function checkStock(productNum, quantity) {
  if (typeof productNum !== "number" || typeof quantity !== "number") {
    throw new Error("Parámetros inválidos para la verificación de stock");
  }

  const product = await productRepo.getByNum(productNum);
  if (!product) {
    throw new Error("Producto no encontrado");
  }

  return product.stock >= quantity;
}
