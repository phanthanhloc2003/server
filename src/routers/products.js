const express = require('express')
const router = express.Router()
const { uploads } = require("../middleware/uploadsImageMiddleware");

const productController = require("../controller/ProductController")
const { authMiddleware } = require('../middleware/authMiddleware');
router.post("/add-product",uploads.single('image'), productController.addProduct)
router.put("/update-product/:id" , productController.updateProduct)
router.get("/details-product/:id",productController.detailsProduct )
router.delete("/delete-product/:id",productController.deleteProduct )
router.get("/getAll-product",productController.getAllProduct )
router.delete("/deleteMany",productController.deleteMany )







module.exports = router