const Order = require('../models/order-model');
const User = require('../models/user-model');

async function getOrders(req, res,next) {
    try {
      const orders = await Order.findAllForUser(res.locals.uid);
      res.render('admin/orders/all-orders', {
        orders: orders,
      });
    } catch (error) {
      next(error);
    }
}

async function addOrder(req, res, next) {
    const cart = req.session.cart; // Changed from res.locals.cart to req.session.cart

    if (!cart || cart.items.length === 0) {
        return res.status(400).json({ message: 'Your cart is empty.' });
    }

    const selectedAddress = req.session.selectedAddress;
    if (!selectedAddress) {
        return res.status(400).json({ message: 'No address selected.' });
    }

    // Add logging to debug cart items
    console.log('Placing Order with Cart Items:', cart.items);

    // Ensure all design items include the color property
    for (const item of cart.items) {
        if (item.design && !item.design.color) {
            console.log('Design item missing color:', item); // Added logging for missing color
            return res.status(400).json({ message: 'Design item is missing the color property.' });
        }
    }

    let userDocument;
    try {
        const userId = req.session.user.id; // Changed from res.locals.uid to req.session.user.id
        userDocument = await User.findById(userId);
        if (!userDocument) {
            return res.status(404).json({ message: 'User not found.' });
        }
    } catch (error) { // Ensure error is defined
        console.error('Error fetching user:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }

    const order = new Order(cart, {
        _id: userDocument._id,
        email: userDocument.email,
        fullname: userDocument.fullname,
        address: selectedAddress
    });

    try{
        await order.save();
        console.log('Order saved successfully:', order);
    } catch (error) { // Define error parameter
        console.error('Error saving order:', error);
        return res.status(500).json({ message: 'Failed to save order.' });
    }

    req.session.cart = null;

    res.json({ 
        success: true, 
        redirectUrl: '/cart/confirmation' // Provide URL for client-side redirection
    });
}

async function updateOrderStatus(req, res, next) {
  const orderId = req.params.orderId;
  const newStatus = req.body.newStatus;

  try {
    const order = await Order.findById(orderId);
    order.status = newStatus;
    await order.save();
    res.json({ newStatus: order.status });
  } catch (error) {
    next(error);
  }
}

module.exports = {
    addOrder: addOrder,
    getOrders: getOrders,
    updateOrderStatus: updateOrderStatus
}