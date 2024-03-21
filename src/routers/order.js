const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const OrderController = require("../controller/OrderController");
const { authUserMiddleware } = require("../middleware/authUserMiddleware");
router.post("/create-order",authUserMiddleware, OrderController.createOrder);

module.exports = router;
