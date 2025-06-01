const express = require('express');
const productsController = require('../controllers/products-controller');

const router = express.Router();

router.get('/t-shirts', productsController.getAllProducts);
router.get('/sweatshirts', productsController.getAllProducts);
router.get('/pants', productsController.getAllProducts);
router.get('/bags', productsController.getAllProducts);

router.get('/products/:id', productsController.getProductDetails); 

module.exports = router;