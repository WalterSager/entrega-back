//  /src/repositories/user.repository.js

import UserDAO from "../daos/mongo/user.dao.js";

const userDAO = new UserDAO();

class UserRepository {

  create(user) {
    return userDAO.saveUser(user);
  }

  get model() {
    return userDAO.model;
  }

  getAll() {
    return userDAO.getUsers();
  }

  getById(id) {
    return userDAO.getUserById(id);
  }

  getByEmail(email) {
    return userDAO.getUserByEmail(email);
  }

  getByNum(num) {
    return userDAO.getUserByNum(num);
  } 

  updateById(id, data) {
    return userDAO.updateUserByID(id, data);
  }

  updateByNum(num, data) {
    return userDAO.updateUserByNum(num, data);
  }

  deleteById(id) {
    return userDAO.deleteUserByID(id);
  }

  deleteByNum(num) {
    return userDAO.deleteUserByNum(num);
  }
}

export default UserRepository;
