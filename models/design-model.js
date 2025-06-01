const { ObjectId } = require('mongodb');
const getDb = require('../data/database').getDb;

class Design {
    constructor(designData) {
        this.color = designData.color;
        this.frontImage = designData.frontImage || null;
        this.backImage = designData.backImage || null;
        this.price = this.calculatePrice();
        this.quantity = 1;
        this.title = 'Your Design';

        // Koordinat verileri
        this.frontLeft = designData.frontLeft || null;
        this.frontTop = designData.frontTop || null;
        this.frontWidth = designData.frontWidth || null;
        this.frontHeight = designData.frontHeight || null;

        this.backLeft = designData.backLeft || null;
        this.backTop = designData.backTop || null;
        this.backWidth = designData.backWidth || null;
        this.backHeight = designData.backHeight || null;

        if (designData._id) {
            this.id = designData._id.toString();
        }
    }

    calculatePrice() {
        let price = 0;
        if (this.frontImage || this.backImage) price = 500;
        if (this.backImage && this.frontImage) price = 800;
        return price;
    }

    async save() {
        const db = getDb();
        const designData = {
            color: this.color,
            frontImage: this.frontImage,
            backImage: this.backImage,
            price: this.price,
            quantity: this.quantity,
            title: this.title,

            // Koordinat verileri
            frontLeft: this.frontLeft,
            frontTop: this.frontTop,
            frontWidth: this.frontWidth,
            frontHeight: this.frontHeight,
            backLeft: this.backLeft,
            backTop: this.backTop,
            backWidth: this.backWidth,
            backHeight: this.backHeight
        };
        const result = await db.collection('designs').insertOne(designData);
        this.id = result.insertedId.toString();
    }

    static async findById(designId) {
        if (!ObjectId.isValid(designId)) {
            throw new Error('Invalid design ID format');
        }
    
        const db = getDb();
        const design = await db.collection('designs').findOne({ _id: new ObjectId(designId) });
    
        if (!design) {
            throw new Error('Design not found');
        }
    
        return new Design({
            ...design,
            title: design.title || 'Custom Design',
            price: design.price || 500
        });
    }
}

module.exports = Design;