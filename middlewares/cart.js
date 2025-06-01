const Cart = require('../models/cart-model');
const Design = require('../models/design-model');

async function initializeCart(req, res, next) {
    if (!req.session.cart) {
        req.session.cart = { items: [], totalQuantity: 0, totalPrice: 0 };
    }

    const sessionCart = req.session.cart;
    const cart = new Cart(
        sessionCart.items,
        sessionCart.totalQuantity,
        sessionCart.totalPrice
    );

    for (const item of cart.items) {
        if (item.design && item.design.id) {
            const design = await Design.findById(item.design.id);
            item.design = { id: design.id, title: design.title, price: design.price, color:design.color, frontImage: design.frontImage, backImage: design.backImage };
        }
    }

    res.locals.cart = cart;
    next();
}

module.exports = initializeCart;