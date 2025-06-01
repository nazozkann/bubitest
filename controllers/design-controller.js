const path = require('path');
const Design = require('../models/design-model');
const User = require('../models/user-model');

async function saveDesign(req, res, next) {
    const color = req.body.color;
    console.log('Received color:', color);

    // Upload edilen görseller
    const frontImage = req.files['designImageFront'] ? req.files['designImageFront'][0].filename : null;
    const backImage = req.files['designImageBack'] ? req.files['designImageBack'][0].filename : null;

    // Koordinat ve boyut verileri
    const frontLeft = req.body.frontLeft;
    const frontTop = req.body.frontTop;
    const frontWidth = req.body.frontWidth;
    const frontHeight = req.body.frontHeight;

    const backLeft = req.body.backLeft;
    const backTop = req.body.backTop;
    const backWidth = req.body.backWidth;
    const backHeight = req.body.backHeight;

    const designData = {
        color: color,
        frontImage: frontImage || null,
        backImage: backImage || null,

        // Koordinat verileri
        frontLeft: frontLeft,
        frontTop: frontTop,
        frontWidth: frontWidth,
        frontHeight: frontHeight,
        backLeft: backLeft,
        backTop: backTop,
        backWidth: backWidth,
        backHeight: backHeight
    };

    try {
        const design = new Design(designData);
        await design.save();

        if (!req.session.cart) {
            req.session.cart = { totalQuantity: 0, items: [], totalPrice: 0 };
        }
        req.session.cart.totalQuantity += 1;
        req.session.cart.totalPrice += design.price;
        req.session.cart.items.push({
            product: null,
            design: { 
                id: design.id, 
                title: design.title, 
                price: design.price, 
                color: design.color,
                frontImage: design.frontImage,
                backImage: design.backImage
            },
            quantity: 1,
            totalPrice: design.price
        });

        console.log('Session cart after adding design:', req.session.cart);

        // Ensure the session is saved before redirecting
        req.session.save(err => {
            if (err) {
                return next(err);
            }
            res.redirect('/cart');
        });
    } catch (error) {
        next(error);
    }
}

async function getDesignById(req, res, next) {
    const designId = req.params.id;

    try {
        const design = await Design.findById(designId);
        res.render('admin/orders/design-orders', { design: design });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    saveDesign: saveDesign,
    getDesignById: getDesignById
};