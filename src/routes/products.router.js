//  /src/routes/products.router.js

import { Router } from "express";
import passport from "passport";
import ProductController from "../controllers/product.controller.js";
import { requireRole } from "../middlewares/auth.middleware.js";

const router = Router();

const prodControl = new ProductController();

// ✅ Crear nuevo producto
router.post("/", prodControl.create);

router.get(
    "/getAll/:role",
    passport.authenticate("jwt", { session: false }),
    (req, res, next) => {
      const allowed = ["ADMIN", "USER"];
      const requested = req.params.role?.toUpperCase();
      if (!allowed.includes(requested) || req.user.role !== requested) {
        return res.status(403).render("403-forbidden", {
          message: "Acceso denegado",
          user: req.user
        });
        
      }
      next();
    },
    prodControl.getAll4ViewByRole
  );
  

// ✅ Obtener todos los productos
router.get("/", prodControl.getAll);

// ✅ Obtener producto por ID
router.get("/id/:id", prodControl.getById);

// ✅ Obtener producto por num
router.get("/num/:num", prodControl.getByNum);

// ✅ Actualizar producto por ID
router.put(
  "/id/:id",
  passport.authenticate("jwt", { session: false }),
  requireRole("ADMIN"),
  prodControl.update
);

// ✅ Eliminar producto por ID
router.delete(
  "/id/:id",
  passport.authenticate("jwt", { session: false }),
  requireRole("ADMIN"),
  prodControl.deleteByID
);

// ✅ Eliminar producto por num
router.delete(
  "/num/:num",
  passport.authenticate("jwt", { session: false }),
  requireRole("ADMIN"),
  prodControl.deleteByNum
);


export default router;





