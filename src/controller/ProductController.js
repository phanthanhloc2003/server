const { imagePath } = require("../constant/pathImagesProduct");
const Product = require("../models/ProductModel");

class ProductController {
  async addProduct(req, res, next) {
    if (!req.file) return res.status(400).send("vui lòng chọn ảnh");
  
    try {
      const { name, type, price, rating, description, countInStock } =
        req.body;
      if (
        !name ||
       
        !type ||
        !price ||
        !rating ||
        !description ||
        !countInStock
      ) {
        return res.status(400).json({
          status: "error",
          message: "All input fields are required",
        });
      }

      const checkProduct = await Product.findOne({
        name: name,
      });
      if (checkProduct !== null) {
        return res.status(400).json({
          status: "error",
          message: "Product already exists",
        });
      }

      const product = new Product({...req.body,image: `${imagePath}${req.file.filename}` });
      await product
        .save()
        .then(() => {
          res.status(201).json({
            status: "success",
            message: "Product created",
            data: product,
          });
        })
        .catch((err) => {
          res.status(500).json({
            status: "error",
            message: err.message,
          });
        });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }

  async updateProduct(req, res, next) {
    try {
      const productId = req.params.id;
      const data = req.body;
      const { name, type, price, rating, description, countInStock } =
        req.body;
      if (
        !name ||
      
        !type ||
        !price ||
        !rating ||
        !description ||
        !countInStock
      ) {
        return res.status(400).json({
          status: "error",
          message: "All input fields are required",
        });
      }
      const newproduct = await Product.findById(productId);
      if (!newproduct) {
        return res.status(400).json({
          status: "error",
          message: "Product not found",
        });
      }
      const updateProduct = await Product.findByIdAndUpdate(productId, data, {
        new: true,
      });
      res.json({
        status: "success",
        message: "Product updated",
        data: updateProduct,
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }

  async detailsProduct(req, res, next) {
    try {
      const productId = req.params.id;
      const detailProduct = await Product.findById(productId);

      if (!detailProduct) {
        return res.status(400).json({
          status: "error",
          message: "Product not found",
        });
      }
      res.json({
        status: "success",
        message: "Product details",
        data: detailProduct,
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }

  async deleteProduct(req, res, next) {
    try {
      const productId = req.params.id;
      const deleteProduct = await Product.findByIdAndDelete(productId);
      if (!deleteProduct) {
        return res.status(400).json({
          status: "error",
          message: "Product not found",
        });
      }
      res.json({
        status: "success",
        message: "Product deleted",
        data: deleteProduct,
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }

  async getAllProduct(req, res, next) {
    try {
      const limit = parseInt(req.query.limit)
      const page = parseInt(req.query.page)
      const sort = req.query.sort;
      const type = req.query.type;

      let sortObject = {};
      const totalProduct = await Product.countDocuments();
      sortObject[sort] = type === "asc" ? 1 : -1;

      const products = await Product.find()
        .skip(page ? page * limit : 0 )
        .limit(limit || 0)
        .sort(sortObject);

      res.json({
        status: "success",
        message: "Products found",
        data: products ,
        total: totalProduct,
        pageCurrent: page + 1,
        pageTotal: Math.ceil(totalProduct / limit),
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }
  async userGetAllProduct(){
  const products = await Product.find()
  res.json({
    status: "success",
    message: "Products found",
    data: products ,
  
  });
  }
}

module.exports = new ProductController();
