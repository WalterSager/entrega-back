//  /src/daos/mongo/utils/hash.js

import bcrypt from "bcrypt";

// Método de encriptación
export function hashPassword(password) {
  return bcrypt.hashSync(password, 10);
}

// Método de comparación
export function comparePassword(plain, hash) {
    return bcrypt.compareSync(plain, hash);
  }