const Order = require("../models/OrderModel");
const Product = require("../models/ProductModel");

class OrderController {
  async createOrder(req, res) {
    const order = req.body;
    try {
      const productIds = order.orderItems.map((item) => item.product);
      const updatePromises = order.orderItems.map(async (item) => {
        const product = await Product.findById(item.product);
        product.countInStock -= item.amount;
        product.selled += item.amount;
        await product.save();
      });
      await Promise.all(updatePromises);
      const orders = new Order(order)
      await orders.save()
      return res.status(200).json({
        status:"thành công",
        data: order
      });
    } catch (error) {
      return res.status(500).json({
        status: "Lỗi khi tạo đơn hàng",
        message: error.message,
      });
    }
  }
}

module.exports = new OrderController();