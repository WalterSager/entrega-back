import ProductService from "../services/product.service.js";

const productService = new ProductService();

class ProductController {

  async create(req, res) {
    const data = req.body;

    try {
      const newProduct = await productService.createProduct(data);
      res.redirect("/api/products/getAll/ADMIN");
    } catch (error) {
      res.status(400).json({ status: "error", message: error.message });
    }
  }


  async getAll(req, res) {
    try {
      const products = await productService.getAllProducts();
      res.json({ status: "success", products });
    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    }
  }


  async getById(req, res) {
    const pid = req.params.id;

    try {
      const product = await productService.getProductById(pid);
      res.json({ status: "success", product });
    } catch (error) {
      res.status(404).json({ status: "error", message: error.message });
    }
  }

  async getByNum(req, res) {
    const num = parseInt(req.params.num);

    if (isNaN(num)) {
      return res.status(400).json({ status: "error", message: "Número de producto inválido" });
    }

    try {
      const product = await productService.getByProductNum(num);
      if (!product) {
        return res.status(404).json({ status: "error", message: "Producto no encontrado" });
      }
      res.json({ status: "success", product });
    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    }
  }

  async getAll4ViewByRole(req, res) {
    try {
      const products = await productService.getAllProducts();
      const plainProducts = products.map(p => p.toObject ? p.toObject() : p);
  
      const role = req.params.role?.toUpperCase();
  
      if (role === "ADMIN") {
        return res.render("products-admin", { products: plainProducts });
      } else if (role === "USER") {
        return res.render("products-user", { products: plainProducts });
      } else {
        return res.status(403).render("403-forbidden", {
          message: "Rol no autorizado o desconocido",
          user: req.user
        });
      }
    } catch (error) {
      console.error("❌ Error en getAll4ViewByRole:", error);
      res.status(500).send("Error al obtener productos");
    }
  }

  async update(req, res) {
    const id = req.params.id;
    const data = req.body;

    try {
      const result = await productService.updateProduct(id, data);
      res.json(result);
    } catch (error) {
      res.status(400).json({ status: "error", message: error.message });
    }
  }


  async deleteByID(req, res) {
    const id = req.params.id;
     
    try {
      const result = await productService.deleteProductByID(id);
      res.json(result);
    } catch (error) {
      res.status(404).json({ status: "error", message: error.message });
    }
  }
  
  async deleteByNum(req, res) {
    const num = parseInt(req.params.num);

    if (isNaN(num)) {
      return res.status(400).json({ status: "error", message: "Número inválido" });
    }

    try {
      const result = await productService.deleteProductByNum(num);
      res.json(result);
    } catch (error) {
      res.status(404).json({ status: "error", message: error.message });
    }
  }
}

export default ProductController;
