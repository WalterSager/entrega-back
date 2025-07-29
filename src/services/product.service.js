//  /src/services/product.service.js

import ProductRepository from "../repositories/product.repository.js";
import { getNextNumber } from "../daos/mongo/utils/getNextNumber.js";

import mongoose from "mongoose";

const productRepo = new ProductRepository();

class ProductService {

    async createProduct(productData) {
        if (!productData || typeof productData !== "object") {
            throw new Error("Datos de producto inválidos");
        }
        
        // Generar ID y número incremental usando el modelo del DAO
        const identifier = new mongoose.Types.ObjectId();
        const ordinalNum = await getNextNumber(productRepo.model);

        // Crear producto completo según el esquema real
        const newProduct = {
            _id : identifier,
            title: productData.title || "Sin título",
            description: productData.description || "",
            code_bar: productData.code_bar || "",
            price: productData.price || 0,
            status: productData.status !== undefined ? productData.status : true,
            stock: productData.stock || 0,
            category: productData.category || "general",
            thumbnails: Array.isArray(productData.thumbnails) ? productData.thumbnails : [],
            num: ordinalNum
        };

        const created = await productRepo.create(newProduct);
        if (!created) {
            throw new Error("No se pudo crear el producto");
        }

        return created;
    }


    async getAllProducts(filter = {}) {
        return await productRepo.getAll(filter);
    }

    async getProductById(pid) {
        if (!pid) throw new Error("ID de producto no proporcionado");
        const product = await productRepo.getById(pid);
        if (!product) throw new Error("Producto no encontrado");
        return product;
    }

    async getByProductNum(num) {
        if (typeof num !== "number") {
            throw new Error("El número de producto debe ser un número válido");
        }
    
        const product = await productRepo.getByNum(num);
        if (!product) {
            throw new Error("Producto no encontrado con ese número");
        }
    
        return product;
    }

    async getProductsByArrayOfNumbers(numbersArray = []) {
        if (!Array.isArray(numbersArray)) throw new Error("El parámetro debe ser un array");
        return await productRepo.getByNumbersArray(numbersArray);
    }

    async updateProduct(pid, updateData) {
        if (!pid || typeof updateData !== "object") {
            throw new Error("Datos inválidos para actualizar el producto");
        }

        const result = await productRepo.update(pid, updateData);
        if (!result || result.modifiedCount === 0) {
            throw new Error("No se pudo actualizar el producto");
        }

        return { status: "success", message: "Producto actualizado correctamente" };
    }

    async deleteProductByID(pid) {
        if (!pid) throw new Error("ID de producto inválido");

        const result = await productRepo.deleteById(pid);
        if (!result || result.deletedCount === 0) {
            throw new Error("No se pudo eliminar el producto o no existe");
        }

        return { status: "success", message: "Producto eliminado correctamente" };
    }

    async deleteProductByNum(num) {
        if (typeof num !== "number") {
          throw new Error("Número de producto inválido");
        }
      
        const result = await productRepo.deleteByNum(num);
        if (!result || result.deletedCount === 0) {
          throw new Error("No se pudo eliminar el producto o no existe");
        }
      
        return { status: "success", message: "Producto eliminado correctamente" };
      }
}

export default ProductService;
