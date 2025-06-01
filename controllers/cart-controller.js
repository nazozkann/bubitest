const { ObjectId } = require('mongodb');
const Product = require('../models/product-model');
const Design = require('../models/design-model');
const User = require('../models/user-model'); // Import User model

function getCart(req, res) {
    res.render('customer/cart/cart');
}

async function addCartItem(req, res, next) {
    const productId = req.body.productId;
    const size = req.body.size;
    const color = req.body.color;
    const designId = req.body.designId;

    let item;

    try {
        if (productId) {
            item = await Product.findById(productId);
        }

        if (!item && designId) {
            item = await Design.findById(designId);
        }

        if (!item) {
            return res.status(404).json({ message: 'Product or Design not found.' });
        }

        item.size = size;
        item.color = color;
    } catch (error) {
        next(error);
        return;
    }

    const cart = res.locals.cart;
    cart.addItem(item);
    req.session.cart = cart;

    res.status(201).json({
        message: 'Cart updated.',
        newTotalItems: cart.totalQuantity
    });
}

async function removeCartItem(req, res, next) {
    const itemId = req.params.itemId;
    const { size, color } = req.body; // New: Extract size and color from request body
    const cart = res.locals.cart;
    const updatedItem = cart.removeItem(itemId, size, color); // New: Pass size and color
    req.session.cart = cart;

    res.status(200).json({
        message: 'Item removed.',
        newTotalItems: cart.totalQuantity,
        newQuantity: updatedItem ? updatedItem.quantity : 0,
        newTotalPrice: cart.totalPrice
    });
}

async function getConfirmation(req, res, next) {
    try {
        res.render('customer/cart/confirmation', {
            pageTitle: 'Order Confirmation'
        });
    } catch (error) {
        next(error);
    }
}

async function saveSelectedAddress(req, res, next) {
    const selectedAddressId = req.body.selectedAddress;

    if (!selectedAddressId) {
        return res.status(400).send('Address selection is required.');
    }

    try {
        const userId = req.session.user.id;
        const user = await User.findById(userId);
        const selectedAddress = user.address.find(addr => addr.id.toString() === selectedAddressId);

        if (!selectedAddress) {
            return res.status(404).send('Selected address not found.');
        }

        // Save selected address to session
        req.session.selectedAddress = selectedAddress;

        // Redirect to payment-info page
        res.redirect('/cart/payment-info');
    } catch (error) {
        next(error);
    }
}

module.exports = {
    addCartItem: addCartItem,
    getCart: getCart,
    removeCartItem: removeCartItem,
    getConfirmation: getConfirmation,
    saveSelectedAddress // Export the function
}