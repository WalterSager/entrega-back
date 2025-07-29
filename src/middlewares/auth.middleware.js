// /middlewares/auth.middleware.js

export function requireRole(requiredRole) {
    return (req, res, next) => {
      if (!req.user || req.user.role !== requiredRole) {
        
        return res.status(403).render("403-forbidden", {
          message: "Unauthorized: acceso restringido",
          user: req.user
        });
      }
      next();
    };
  }

  