import SessionService from "../services/session.service.js";
import UserDTO from "../DTO/user.DTO.js";
import config from "../config/index.js";
import jwt from "jsonwebtoken";

const sessionService = new SessionService();

class SessionsController {
  async login(req, res) {
    const { email, password } = req.body;
    try {
      const user = await sessionService.authenticateUser(email, password);
      const token = jwt.sign({ id: user._id, role: user.role }, config.SECRET, {
        expiresIn: "1h",
      });

      res
        .cookie("token", token, {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
          maxAge: 3600000,
        })
        .redirect(`/api/products/getAll/${user.role}`);
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  }

  async logout(req, res) {
    res.clearCookie("token").redirect("/views/login");
  }

  async current(req, res) {
    const safeUser = new UserDTO(req.user);
    res.json(safeUser);
  }

  async forgotPassword(req, res) {
    const { email } = req.body;
    try {
      await sessionService.sendRecoveryEmail(email);
      res.json({ status: "success", message: "Correo de recuperación enviado. El Token para pruebas está en consola de VS" });
    } catch (err) {
      res.status(500).json({ status: "error", message: err.message });
    }
  }

  async resetPassword(req, res) {
    const { token, newPassword } = req.body;
    try {
      await sessionService.resetPassword(token, newPassword);
      res.render("login", { message: "Contraseña actualizada correctamente" });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
}

export default SessionsController;