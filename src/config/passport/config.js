// /src/config/passport/config.js

import passport from "passport";
import { jwtStrategy } from "../JWT/jwt.strategy.js";




const initializedPassport = () => {
  passport.use("jwt", jwtStrategy);
};

export default initializedPassport;


