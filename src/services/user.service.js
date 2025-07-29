//  /src/services/user.service.js

import mongoose from "mongoose";
import { hashPassword } from "../daos/mongo/utils/hash.js";
import { getNextNumber } from "../daos/mongo/utils/getNextNumber.js";
import UserRepository from "../repositories/user.repository.js";
import CartService from "./cart.service.js"; // arriba del archivo

const userRepo = new UserRepository();
const cartRepo = new CartService();

class UserService {

  async createUser(body) { 
    const { first_name, last_name, age, email, password, role } = body;
  
    if (!email || !password || !first_name || !last_name) {
      throw new Error("Faltan campos obligatorios");
    }
  
    const existingUser = await userRepo.getByEmail(email);
    if (existingUser) {
      throw new Error("El usuario ya existe con ese email");
    }
  
    const hashedPassword = hashPassword(password);
    const newId = new mongoose.Types.ObjectId();
    const nextNum = await getNextNumber(userRepo.model);
  
    // Validar rol recibido
    const allowedRoles = ["USER", "ADMIN"];
    const assignedRole = allowedRoles.includes(role) ? role : "USER";
  
    const newUser = {
      _id: newId,
      first_name,
      last_name,
      age: age || null,
      email,
      password: hashedPassword,
      role: assignedRole,
      cart: null,
      num: nextNum
    };
  
    let createdUser;
  
    try {
      createdUser = await userRepo.create(newUser);
    } catch (error) {
      if (error.code === 11000 && error.keyPattern?.email) {
        throw new Error("El usuario ya existe con ese email (detected al guardar)");
      }
      throw error;
    }
  
    await cartRepo.createEmptyCart(createdUser._id);
  
    return createdUser;
  }
  

  
  async getAll() {
    return await userRepo.getAll();
  }

  async getById(id) {
    return await userRepo.getById(id);
  }

  async getByNum(num) {
    if (typeof num !== "number") {
      throw new Error("Número inválido");
    }

    const user = await userRepo.getByNum(num);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    return user;
  }

  async getByEmail(email) {
    if (!email || typeof email !== "string") {
      throw new Error("Email inválido");
    }

    const user = await userRepo.getByEmail(email);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    return user;
  }


  async tryEmail(email) {
    if (!email || typeof email !== "string") {
      return false;
    }
  
    const user = await userRepo.getByEmail(email);
    return !!user; // true si existe, false si no
  }
  
  async updateUserByID(id, updateData) {
    if (!id || typeof updateData !== "object") {
      throw new Error("Parámetros inválidos para actualizar el usuario");
    }

    const result = await userRepo.updateById(id, updateData);

    if (!result || result.modifiedCount === 0) {
      throw new Error("No se pudo actualizar el usuario o no se encontró");
    }

    return { status: "success", message: "Usuario actualizado correctamente" };
  }

  async updateUserByNum(num, updateData) {
    if (typeof num !== "number" || typeof updateData !== "object") {
      throw new Error("Parámetros inválidos para actualizar el usuario");
    }

    const result = await userRepo.updateByNum(num, updateData);
    if (!result || result.modifiedCount === 0) {
      throw new Error("No se pudo actualizar el usuario o no se encontró");
    }

    return { status: "success", message: "Usuario actualizado correctamente" };
  }

  async changePassword(id, newPlainPass) {
    if (!id || typeof newPlainPass !== "string") {
      throw new Error("Parámetros inválidos");
    }

    // 1. Obtener el usuario completo
    const prevUser = await userRepo.getById(id);
    if (!prevUser) {
      throw new Error("Usuario no encontrado");
    }

    // 2. Hashear la nueva contraseña
    const newHashedPassword = hashPassword(newPlainPass);

    // 3. Construir objeto actualizado (sin el _id)
    const updatedUser = {
      first_name: prevUser.first_name,
      last_name: prevUser.last_name,
      age: prevUser.age,
      email: prevUser.email,
      password: newHashedPassword,
      cart: prevUser.cart,
      role: prevUser.role,
      num: prevUser.num
    };

    // 4. Guardar el usuario actualizado
    const result = await userRepo.updateById(id, updatedUser);
    if (!result || result.modifiedCount === 0) {
      throw new Error("No se pudo cambiar la contraseña");
    }

    return { status: "success", message: "Contraseña actualizada correctamente" };
  }

  async deleteUserByID(id) {
    if (!id) throw new Error("ID de usuario inválido");

    const result = await userRepo.deleteById(id);
    if (!result || result.deletedCount === 0) {
      throw new Error("No se encontró el usuario o no se pudo eliminar");
    }

    return { status: "success", message: "Usuario eliminado correctamente" };
  }

  async deleteUserByNum(num) {
    if (typeof num !== "number") {
      throw new Error("Número inválido");
    }

    const result = await userRepo.deleteByNum(num);
    if (!result || result.deletedCount === 0) {
      throw new Error("No se encontró el usuario o no se pudo eliminar");
    }

    return { status: "success", message: "Usuario eliminado correctamente" };
  }

  async login(email, plainPassword) {
    const user = await userRepo.getByEmail(email);
    if (!user) throw new Error("Usuario no encontrado");

    const valid = comparePassword(plainPassword, user.password);
    if (!valid) throw new Error("Contraseña incorrecta");

    return user; // o token, etc.
  }

}

export default UserService;
