//  /src/routes/user.router.js

import { Router } from "express";

import UserController from "../controllers/user.controller.js";

const router = Router();

const userController = new UserController();


//  ✅ Crear nuevo usuario (Desde el front)
router.post("/register", (req, res) => userController.saveUser(req, res));

//  ✅ Crear nuevo usuario
router.post("/", userController.saveUser);

// ✅ Obtener todos los usuarios
router.get("/", userController.getUsers);

// ✅ Obtener un usuario por _id
router.get("/id/:id", userController.getUserById);

// ✅ Obtener un usuario por num
router.get("/num/:num", userController.getUserByNum);

// ✅ Actualizar usuario por _id
router.put("/id/:id", userController.updateUserByID);

// ✅ Actualizar usuario por num
router.put("/num/:num", userController.updateUserByNum);


// ✅ Eliminar un usuario por _id
router.delete("/id/:id", userController.deleteUserByID);

// ✅ Eliminar un usuario por num
router.delete("/num/:num", userController.deleteUserByNum);
export default router;
