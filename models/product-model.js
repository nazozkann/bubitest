const { ObjectId } = require("mongodb");

const db = require("../data/database");

/**
 * 🛠  Product Model – Cloudinary + Local‑file uyumlu
 * -------------------------------------------------
 * • Cloudinary üzerinden gelen tam URL'leri **imageUrls[]** dizisinde saklar.
 * • Eski yapıyla kaydedilmiş image1…image4 alanlarını da hâlâ okuyabilir.
 * • Yerel dosya ismi (http ile başlamayan) geldiğinde otomatik olarak
 *   `/products/assets/images/` prefix'i ekler – böylece geriye‑uyumluluk korunur.
 */
class Product {
  /**
   * Public helper – bazı controller'lar halen `product.updateImageData()` çağırıyor.
   * Eski ve yeni alanları senkronize ederek `imageUrls` dizisini günceller.
   */
  updateImageData() {
    // Yeni modelde imageUrls zaten varsa dokunmayız
    if (this.imageUrls && this.imageUrls.length) return;
    this._updateImageDataFromLegacyFields();
  }
  constructor(productData) {
    this.title = productData.title;
    this.price = Number(productData.price);
    this.category = productData.category;
    this.colors = productData.colors || [];
    this.sizes = productData.sizes || [];

    // Yeni alan (tercih edilir)
    this.imageUrls = productData.imageUrls || [];

    // Eski alanlarla geriye‑uyumluluk
    this.image1 = productData.image1 || null;
    this.image2 = productData.image2 || null;
    this.image3 = productData.image3 || null;
    this.image4 = productData.image4 || null;

    // imageUrls boşsa eski alanlardan üret
    if (this.imageUrls.length === 0) {
      this._updateImageDataFromLegacyFields();
    }

    if (productData._id) this.id = productData._id.toString();
  }

  /* ------------------------------------------------------------------
     🔍  FIND HELPERS
  ------------------------------------------------------------------ */
  static async findById(productId) {
    const doc = await db
      .getDb()
      .collection("products")
      .findOne({ _id: new ObjectId(productId) });

    if (!doc) {
      const err = new Error("Could not find product.");
      err.code = 404;
      throw err;
    }

    return new Product(doc);
  }

  static async findAll() {
    const docs = await db.getDb().collection("products").find().toArray();
    return docs.map((d) => new Product(d));
  }

  static async findByCategory(category) {
    const docs = await db
      .getDb()
      .collection("products")
      .find({ category })
      .toArray();
    return docs.map((d) => new Product(d));
  }

  static async findByIds(ids) {
    const objectIds = ids.map((id) => new ObjectId(id));
    const docs = await db
      .getDb()
      .collection("products")
      .find({ _id: { $in: objectIds } })
      .toArray();
    return docs.map((d) => new Product(d));
  }

  /* ------------------------------------------------------------------
     🚀  SAVE / UPDATE / DELETE
  ------------------------------------------------------------------ */
  async save() {
    const doc = {
      title: this.title,
      price: this.price,
      category: this.category,
      colors: this.colors,
      sizes: this.sizes,
      imageUrls: this.imageUrls,
      // legacy alanlar (istiyorsan kaldırabilirsin)
      image1: this.image1,
      image2: this.image2,
      image3: this.image3,
      image4: this.image4,
    };

    if (this.id && ObjectId.isValid(this.id)) {
      await db
        .getDb()
        .collection("products")
        .updateOne({ _id: new ObjectId(this.id) }, { $set: doc });
    } else {
      const res = await db.getDb().collection("products").insertOne(doc);
      this.id = res.insertedId.toString();
    }
  }

  async remove() {
    if (!this.id) return;
    await db
      .getDb()
      .collection("products")
      .deleteOne({ _id: new ObjectId(this.id) });
  }

  /* ------------------------------------------------------------------
     🛠  IMAGE HELPERS
  ------------------------------------------------------------------ */
  /**
   * Legacy image1…image4 alanlarından imageUrls dizisi üretir.
   * Cloudinary URL'si zaten http ile başlıyorsa dokunmaz; değilse yerel prefix ekler.
   */
  _updateImageDataFromLegacyFields() {
    const addPrefixIfLocal = (url) =>
      !url
        ? null
        : url.startsWith("http")
        ? url
        : `/products/assets/images/${url}`;

    this.imageUrls = [
      addPrefixIfLocal(this.image1),
      addPrefixIfLocal(this.image2),
      addPrefixIfLocal(this.image3),
      addPrefixIfLocal(this.image4),
    ].filter(Boolean);
  }
}

module.exports = Product;
