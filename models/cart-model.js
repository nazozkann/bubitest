const Product = require('./product-model');
const Design = require('./design-model');

class Cart {
    constructor(items = [], totalQuantity = 0, totalPrice = 0) {
        this.items = items;
        this.totalQuantity = totalQuantity;
        this.totalPrice = totalPrice;
    }

    addItem(item) {
        if (!item.size || !item.color) {
            throw new Error('Item must have size and color attributes');
        }

        const isProduct = item instanceof Product;
        const isDesign = item instanceof Design;
    
        const cartItemIndex = this.items.findIndex(cartItem =>
            (cartItem.product && cartItem.product.id === item.id && cartItem.size === item.size && cartItem.color === item.color) ||
            (cartItem.design && cartItem.design.id === item.id && cartItem.size === item.size && cartItem.color === item.color)
        );
    
        if (cartItemIndex >= 0) {
            const existingCartItem = this.items[cartItemIndex];
            existingCartItem.quantity++;
            existingCartItem.totalPrice += item.price;
            this.items[cartItemIndex] = existingCartItem;
        } else {
            const newCartItem = {
                product: isProduct ? { id: item.id, title: item.title, price: item.price } : null,
                design: isDesign ? { id: item.id, title: item.title, price: item.price } : null,
                quantity: 1,
                totalPrice: item.price,
                size: item.size,
                color: item.color,
            };
            this.items.push(newCartItem);
        }
    
        this.totalQuantity++;
        this.totalPrice += item.price;
    }

    removeItem(itemId, size, color) { // Updated parameters
        const cartItemIndex = this.items.findIndex(cartItem => 
            (cartItem.product && cartItem.product.id === itemId && cartItem.size === size && cartItem.color === color) || 
            (cartItem.design && cartItem.design.id === itemId && cartItem.size === size && cartItem.color === color)
        );

        if (cartItemIndex < 0) {
            return null;
        }
    
        const cartItem = this.items[cartItemIndex];
    
        if (cartItem.quantity > 1) {
            cartItem.quantity--;
            cartItem.totalPrice -= cartItem.product ? cartItem.product.price : cartItem.design.price;
            this.totalQuantity--;
            this.totalPrice -= cartItem.product ? cartItem.product.price : cartItem.design.price;
            this.items[cartItemIndex] = cartItem;
            return cartItem;
        } else {
            this.totalQuantity -= cartItem.quantity;
            this.totalPrice -= cartItem.totalPrice;
            this.items.splice(cartItemIndex, 1);
            return null;
        }
    }
}

module.exports = Cart;


