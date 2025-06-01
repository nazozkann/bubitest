const mongodb = require('mongodb');
const db = require('../data/database');

class Order {
    constructor(cart, userData, status = 'hazırlanıyor', date, orderId) {
        this.productData = cart;
        this.userData = userData;
        this.status = status;
        this.date = new Date(date);
        if (this.date) {
            this.formattedDate = this.date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
        this.id = orderId;
        this.address = userData.address; // New property
    }

    static transformOrderDocument(orderDoc) {
        return new Order(
          orderDoc.productData,
          orderDoc.userData,
          orderDoc.status,
          orderDoc.date,
          orderDoc._id
        );
    }

    static transformOrderDocuments(orderDocs) {
        return orderDocs.map(this.transformOrderDocument);
    }

    static async findAll() {
        const orders = await db
          .getDb()
          .collection('orders')
          .find()
          .project({ 'userData.password': 0 })
          .sort({ _id: -1 })
          .toArray();

        console.log(orders);
        return this.transformOrderDocuments(orders);
    }

    static async findAllForUser(userId) {
        const uid = new mongodb.ObjectId(userId);

        const orders = await db
          .getDb()
          .collection('orders')
          .find({ 'userData._id': uid })
          .sort({ _id: -1 })
          .toArray();

        return this.transformOrderDocuments(orders);
    }

    static async findById(orderId) {
        const order = await db
          .getDb()
          .collection('orders')
          .findOne({ _id: new mongodb.ObjectId(orderId) });

        return this.transformOrderDocument(order);
    }

    async save() {
        if (this.id) {
            const orderId = new mongodb.ObjectId(this.id);
            return db
                .getDb()
                .collection('orders')
                .updateOne({ _id: orderId }, { $set: { status: this.status } });
        } else {
            // Removed design color validation to prevent duplicate checks
            /*
            // Validate design items
            this.productData.items.forEach(item => {
                if (item.design) {
                    if (!item.design.color) {
                        throw new Error('Design item is missing the color property.');
                    }
                    // Add other necessary validations if needed
                }
            });
            */

            const orderDocument = {
                userData: this.userData,
                productData: this.productData,
                date: new Date(),
                status: this.status,
                address: this.address // Include address
            };
            return db.getDb().collection('orders').insertOne(orderDocument);
        }
    }
}

module.exports = Order;