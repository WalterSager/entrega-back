import jwt from "jsonwebtoken";

import UserService from "../services/user.service.js";
import config from "../config/index.js"; 



const userService = new UserService()

class UserController {
  // Crear un usuario
  async saveUser(req, res) {
    const { first_name, last_name, email, password, age, role } = req.body;
  
    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ status: "error", message: "Missing fields" });
    }
  
    try {
      // Crear el usuario
      const createdUser = await userService.createUser({
        first_name,
        last_name,
        email,
        password,
        age,
        role
      });
  
      // Generar token JWT
      const token = jwt.sign(
        { id: createdUser._id, role: createdUser.role },
        config.SECRET,
        { expiresIn: "1h" }
      );
  
      // Guardar el token en cookie y redirigir según rol
      res
        .cookie("token", token, {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
          maxAge: 3600000,
        })
        .redirect(`/api/products/getAll/${createdUser.role}`);
    } catch (error) {
      console.error("❌ Error en saveUser:", error.message);
      res.status(500).json({ status: "error", message: error.message });
    }
  }
  


  // Obtener todos los usuarios
  async getUsers(req, res) {
    try {
      const users = await userService.getAll();
      res.json({ status: "success", users });
    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    }
  }


  // Obtener usuario por ID
  async getUserById(req, res) {
    const id = req.params.id;

    try {
      const user = await userService.getById(id);
      if (!user) {
        return res.status(404).json({ status: "error", message: "User not found" });
      }
      res.json({ status: "success", user });
    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    }
  }

  async getUserByNum(req, res) {
    const num = parseInt(req.params.num);

    if (isNaN(num)) {
      return res.status(400).json({ status: "error", message: "Número inválido" });
    }

    try {
      const user = await userService.getByNum(num);
      res.json({ status: "success", user });
    } catch (error) {
      res.status(404).json({ status: "error", message: error.message });
    }
  }


  async getUserByEmail(req, res) {
    const email = req.params.email;
  
    if (!email) {
      return res.status(400).json({ status: "error", message: "Email requerido" });
    }
  
    try {
      const user = await userService.tryEmail(email);
      res.json({ status: "success", user });
    } catch (error) {
      res.status(404).json({ status: "error", message: error.message });
    }
  }

  // Actualizar usuario
  async updateUserByID(req, res) {
    const id = req.params.id;
    const updateData = req.body;

    try {
      const result = await userService.updateUserByID(id, updateData);
      res.json(result);
    } catch (error) {
      res.status(400).json({ status: "error", message: error.message });
    }
  }

  // Actualizar usuario por num
  async updateUserByNum(req, res) {
    const num = parseInt(req.params.num);
    const updateData = req.body;
    const email = updateData.email;
    if (isNaN(num)) {
      return res.status(400).json({ status: "error", message: "Número inválido" });
    }
    
    if (email) {
      const emailInUse = await userService.tryEmail(email);
      if (emailInUse) {
        return res.status(400).json({ status: "error", message: "Email already in use" });
      }
    }
  
   
    try {
      const result = await userService.updateUserByNum(num, updateData);
      res.json(result);
    } catch (error) {
      res.status(400).json({ status: "error", message: error.message });
    }
  }
  // Eliminar usuario
  async deleteUserByID(req, res) {
    const id = req.params.id;

    try {
      const result = await userService.deleteUserByID(id);
      res.json(result);
    } catch (error) {
      res.status(404).json({ status: "error", message: error.message });
    }
  }

  // Eliminar usuario por num
  async deleteUserByNum(req, res) {
    const num = parseInt(req.params.num);

    if (isNaN(num)) {
      return res.status(400).json({ status: "error", message: "Número inválido" });
    }

    try {
      const result = await userService.deleteUserByNum(num);
      res.json(result);
    } catch (error) {
      res.status(404).json({ status: "error", message: error.message });
    }
  }
}

export default UserController;
