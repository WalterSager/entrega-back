// /src/config/JWT/jwt.strategy.js

import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import config from "../index.js";
import UserDAO from "../../daos/mongo/user.dao.js";



const userDAO = new UserDAO();

const cookieExtractor = req => {
  const token = req.cookies?.token;
  return token || null;
};

const options = {
  jwtFromRequest: cookieExtractor, // ✅ ahora toma el token desde la cookie
  secretOrKey: config.SECRET,
};

export const jwtStrategy = new JwtStrategy(options, async (jwt_payload, done) => {
  try {
    const user = await userDAO.getUserById(jwt_payload.id);
    if (!user) return done(null, false);
    done(null, user);
  } catch (err) {
    done(err, false);
  }
});