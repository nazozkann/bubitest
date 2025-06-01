const bcrypt = require('bcryptjs');
const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectId;
const Product = require('./product-model'); // Add this line

const db = require('../data/database');

class User {
    constructor(id, email, password, fullname, address = [], favorites = []) {
        this.id = id ? new ObjectId(id) : null;
        this.email = email;
        this.password = password;
        this.fullname = fullname;
        this.address = address;
        this.favorites = favorites;
    } 

    static async findById(userId) {
        const uid = new mongodb.ObjectId(userId);

        return db.getDb().collection('users').findOne({ _id: uid }, { projection : { password: 0 } });
    }

    getUserWithSameEmail() {
        return db.getDb().collection('users').findOne({ email: this.email });
    }

    async existsAlready() {
        const existingUser = await this.getUserWithSameEmail();
        if(existingUser) {
            return true;
        }
        return false;
    }

    async signup() {
    const hashedPassword = await bcrypt.hash(this.password, 12);

        await db.getDb().collection('users').insertOne({
            email: this.email,
            password: hashedPassword,
            fullname: this.fullname,
            address: this.address,
        });
    }

    async addAddress(address) {
        const userId = this.id;
        await db.getDb().collection('users').updateOne(
            { _id: userId },
            { $push: { address: address } }
        );
    }
    async removeAddress(address) {
        await db.getDb().collection('users').deleteOne(
            { _id: userDocument._id },
            { $set: { address: userDocument.address } }
        );
    }

    async addFavorite(productId) {
        await db.getDb().collection('users').updateOne(
            { _id: this.id },
            { $addToSet: { favorites: new ObjectId(productId) } }
        );
    }

    async removeFavorite(productId) {
        await db.getDb().collection('users').updateOne(
            { _id: this.id },
            { $pull: { favorites: new ObjectId(productId) } }
        );
    }

    hasMatchingPassword(hashedPassword){
        return bcrypt.compare(this.password, hashedPassword);
    }


}

module.exports = User;