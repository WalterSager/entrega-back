//  /src/repositories/product.repository.js

import ProductDAO from "../daos/mongo/product.dao.js";

const productDAO = new ProductDAO();

class ProductRepository {

  create(product) {
    return productDAO.createProduct(product);
  }

  get model() {
    return productDAO.model;
  }

  getAll(filters) {
    return productDAO.getProducts(filters);
  }

  getById(pid) {
    return productDAO.getProductById(pid);
  }

  getByNum(num) {
    return productDAO.getProductByNum(num);
  } 

  getByNumbersArray(numbersArray) {
    return productDAO.getProductsByProductNumbers(numbersArray);
  } 

  update(pid, data) {
    return productDAO.updateProduct(pid, data);
  }

  deleteById(pid) {
    return productDAO.deleteProductByID(pid);
  }

  deleteByNum(num) {
    return productDAO.deleteProductByNum(num);
  }
}

export default ProductRepository;
