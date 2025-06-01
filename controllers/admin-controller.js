const Product = require("../models/product-model");
const Order = require("../models/order-model");

async function getProducts(req, res, next) {
  try {
    const products = await Product.findAll();
    products.forEach((p) => p.updateImageData());
    const user = res.locals.user;
    res.render("admin/products/all-products", {
      products: products,
      user: user,
    });
  } catch (error) {
    next(error);
    return;
  }
}

function getNewProduct(req, res) {
  res.render("admin/products/new-product");
}

async function createNewProduct(req, res, next) {
  try {
    const uploadedUrls = (req.body.uploadedImageUrls || "")
      .split(",")
      .filter(Boolean);

    const productData = {
      title: req.body.title,
      price: Number(req.body.price),
      category: req.body.category,
      colors: [].concat(req.body.colors || []),
      sizes: [].concat(req.body.sizes || []),
      imageUrls: uploadedUrls,
    };

    const product = new Product(productData);
    await product.save();
    res.redirect("/admin/products");
  } catch (error) {
    next(error);
  }
}

async function getUpdateProduct(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      const error = new Error("Could not find product.");
      error.statusCode = 404;
      throw error;
    }
    product.updateImageData();
    res.render("admin/products/update-product", { product: product });
  } catch (error) {
    next(error);
  }
}

async function updateProduct(req, res, next) {
  try {
    const existingProduct = await Product.findById(req.params.id);

    if (!existingProduct) {
      const error = new Error("Product not found.");
      error.statusCode = 404;
      throw error;
    }

    const uploadedUrls = req.body.uploadedImageUrls
      ? req.body.uploadedImageUrls.split(",")
      : [];

    const product = new Product({
      title: req.body.title,
      price: Number(req.body.price),
      category: req.body.category,
      colors: Array.isArray(req.body.colors)
        ? req.body.colors
        : [req.body.colors].filter(Boolean),
      sizes: Array.isArray(req.body.sizes)
        ? req.body.sizes
        : [req.body.sizes].filter(Boolean),
      image1: uploadedUrls[0] || existingProduct.image1,
      image2: uploadedUrls[1] || existingProduct.image2,
      image3: uploadedUrls[2] || existingProduct.image3,
      image4: uploadedUrls[3] || existingProduct.image4,
      _id: req.params.id,
    });

    await product.save();
    res.redirect("/admin/products");
  } catch (error) {
    next(error);
  }
}

async function getOrders(req, res, next) {
  try {
    const orders = await Order.findAll();
    res.render("admin/orders/all-orders", {
      orders: orders,
      isAdmin: true,
    });
  } catch (error) {
    next(error);
  }
}

async function updateOrder(req, res, next) {
  const orderId = req.params.id;
  const newStatus = req.body.newStatus;

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    order.status = newStatus;

    await order.save();

    res.json({ newStatus: order.status });
  } catch (error) {
    console.error("Error updating order:", error);
    next(error);
  }
}

async function deleteProduct(req, res, next) {
  let product;
  try {
    product = await Product.findById(req.params.id);
    await product.remove();
  } catch (error) {
    return next(error);
  }
  res.json({ message: "Delete success!" });
}

module.exports = {
  getProducts: getProducts,
  getNewProduct: getNewProduct,
  createNewProduct: createNewProduct,
  getUpdateProduct: getUpdateProduct,
  updateProduct: updateProduct,
  deleteProduct: deleteProduct,
  getOrders: getOrders,
  updateOrder: updateOrder,
};
