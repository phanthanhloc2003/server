const user = require("./user");
const product = require("./products");
const order = require("./order");

function route(app) {
  app.use("/api/product", product);
  app.use("/api/user", user);
  app.use("/api/order", order);
}
module.exports = route;
