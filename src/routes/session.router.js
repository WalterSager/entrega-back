// /src/routes/session.router.js

import { Router } from "express";
import passport from "passport";
import SessionsController from "../controllers/session.controller.js";

const sessionController = new SessionsController();
const router = Router();

router.post("/login", sessionController.login);
router.post("/logout", sessionController.logout);
router.get("/current", passport.authenticate("jwt", { session: false }), sessionController.current);
router.post("/forgot-password", sessionController.forgotPassword);
router.post("/reset-password", sessionController.resetPassword);

export default router;