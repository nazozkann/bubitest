const Product = require("../models/product-model");
const User = require("../models/user-model");

async function getAllProducts(req, res, next) {
  try {
    const category = req.path.split("/")[1];

    const products = await Product.findByCategory(category);

    let user = null;
    if (req.session.user) {
      user = await User.findById(req.session.user.id);
      user.favorites = user.favorites || [];
    }

    res.render(`customer/products/${category}`, {
      products: products,
      user: user,
    });
  } catch (error) {
    next(error);
  }
}

async function getProductDetails(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    let user = null;
    if (req.session.user) {
      user = await User.findById(req.session.user.id);
      user.favorites = user.favorites || [];
    }
    res.render("customer/products/product-details", {
      product: product,
      user: user,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllProducts,
  getProductDetails,
};
