const express = require('express');

const cartController = require('../controllers/cart-controller');
const userController = require('../controllers/user-controller'); // Import userController
const User = require('../models/user-model'); // Import User model
const ordersController = require('../controllers/orders-controller'); // Import ordersController

const router = express.Router();

router.get('/', cartController.getCart);

router.get('/checkout', async function(req, res) {
    if (!req.session.user) {
        return res.redirect('/signin'); // or whatever your signin route is
    }
    const userId = req.session.user.id;
    const user = await User.findById(userId);
    res.render('customer/cart/checkout', { addresses: user.address });
});

router.get('/add-address', function(req, res) {
    res.render('customer/cart/add-address-form', {
        address: null,
        csrfToken: req.csrfToken(),
        redirectTarget: req.query.redirect || 'cart'
    });
});

router.get('/edit-address/:addressId', userController.editAddress); // Ensure this route includes the address ID

router.post('/add-address', userController.addAddress); // Ensure this route is correctly defined

router.post('/update-address/:addressId', userController.updateAddress);

router.delete('/update-address/:addressId', userController.deleteAddress);

router.post('/checkout', function(req, res) {
    // Handle form submission and redirect to the checkout page
    res.redirect('/cart/checkout');
});

// Route to display payment information page
router.get('/payment-info', function(req, res) {
    res.render('customer/cart/payment-info', {
        csrfToken: req.csrfToken()
    });
});

// Route to handle placing the order
router.post('/place-order', ordersController.addOrder);

// Route to handle adding an item to the cart
router.post('/items', function(req, res, next) {
    const { productId, size, color } = req.body;
    if (!size || !color) {
        return res.status(400).json({ message: 'Size and color are required.' });
    }
    cartController.addCartItem(req, res, next);
});

// Route to handle removing an item from the cart with size and color
router.delete('/items/:itemId', function(req, res, next) {
    // Ensure the request has a JSON body
    if (!req.body.size || !req.body.color) {
        return res.status(400).json({ message: 'Size and color are required to remove an item.' });
    }
    cartController.removeCartItem(req, res, next);
});

// Route to display order confirmation page
router.get('/confirmation', cartController.getConfirmation);

router.post('/payment-info', cartController.saveSelectedAddress);

module.exports = router;