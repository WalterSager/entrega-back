//  /src/routes/index.router.js


import { Router } from "express";
import usersRouter from "./users.router.js";
import sessionRouter from "./session.router.js";
import productsRouter from "./products.router.js";
import cartsRouter from "./carts.router.js";

const indexRouter = Router();

indexRouter.use("/users", usersRouter);
indexRouter.use("/sessions", sessionRouter);
indexRouter.use("/products", productsRouter);
indexRouter.use("/carts", cartsRouter);

export default indexRouter;
