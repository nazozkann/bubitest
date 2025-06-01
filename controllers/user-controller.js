const User = require('../models/user-model');
const { ObjectId } = require('mongodb');
const db = require('../data/database'); // Import the database module
const Product = require('../models/product-model');

async function addAddress(req, res, next) {
    const userId = req.session.user.id;
    const userDocument = await User.findById(userId);
    const user = new User(userDocument._id, userDocument.email, null, userDocument.fullname, userDocument.address);

    const address = {
        id: new ObjectId(), // Add this line to assign an id
        fullName: req.body.fullName,
        phoneNumber: req.body.phoneNumber,
        city: req.body.city,
        postCode: req.body.postCode,
        district: req.body.district,
        street: req.body.street,
        apartment: req.body.apartment
    };

    try {
        await user.addAddress(address);
        const redirectRoute = req.body.redirect === 'profile' ? '/profile/addresses' : '/cart/checkout';
        res.redirect(redirectRoute);
    } catch (error) {
        next(error);
    }
}

async function editAddress(req, res, next) {
    const userId = req.session.user.id;
    const addressId = new ObjectId(req.params.addressId); // Convert addressId to ObjectId
    const userDocument = await User.findById(userId);

    if (!userDocument || !Array.isArray(userDocument.address)) {
        return res.status(404).render('404');
    }

    const address = userDocument.address.find(addr => addr.id && addr.id.equals(addressId)); // Ensure addr.id exists before calling equals

    if (!address) {
        return res.status(404).render('404');
    }

    res.render('customer/cart/edit-address', { address: address, csrfToken: req.csrfToken() });
}

async function updateAddress(req, res, next) {
    const userId = req.session.user.id;
    const userDocument = await User.findById(userId);
    const addressId = new ObjectId(req.params.addressId);

    if (!userDocument || !Array.isArray(userDocument.address)) {
        return res.status(404).render('404');
    }

    const addressIndex = userDocument.address.findIndex(addr => addr.id && addr.id.equals(addressId)); // Ensure addr.id exists before calling equals

    if (addressIndex === -1) {
        return res.status(404).render('404');
    }

    userDocument.address[addressIndex] = {
        id: addressId,
        fullName: req.body.fullName,
        phoneNumber: req.body.phoneNumber,
        city: req.body.city,
        postCode: req.body.postCode,
        district: req.body.district,
        street: req.body.street,
        apartment: req.body.apartment
    };

    try {
        await db.getDb().collection('users').updateOne(
            { _id: userDocument._id },
            { $set: { address: userDocument.address } }
        );
        res.redirect('/cart/checkout');
    } catch (error) {
        next(error);
    }
}

async function deleteAddress(req, res, next) {
    const userId = req.session.user.id; // Kullanıcı ID'sini oturumdan alıyoruz
    const addressId = new ObjectId(req.params.addressId); // Address ID'yi ObjectId'ye çeviriyoruz

    try {
        // MongoDB sorgusu:
        const result = await db.getDb().collection('users').updateOne(
            { _id: new ObjectId(userId) },
            { $pull: { address: { id: addressId } } } // Address dizisinden ID'yi eşleşerek sil
        );

        // Silme işleminden sonra sonuç kontrolü:
        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: 'Address not found or already deleted.' });
        }

        res.json({ message: 'Delete success!', redirect: req.query.redirect });
    } catch (error) {
        console.error('Error deleting address:', error); // Hata varsa logla
        next(error); // Hata yönetimi için sonraki middleware'e gönder
    }
}

async function toggleFavorite(req, res, next) {
    const userId = req.session.user.id;
    const productId = req.body.productId;  // Frontend'den gelen (string) productId
  
    try {
      // 1) Kullanıcıyı bul
      const userDocument = await User.findById(userId);
  
      // 2) User sınıfı ile yeniden oluştur (favoriler ObjectId dizisi olarak gelecek)
      const user = new User(
        userDocument._id,
        userDocument.email,
        null, // password yok
        userDocument.fullname,
        userDocument.address,
        userDocument.favorites
      );
  
      user.favorites = user.favorites || [];
  
      // 3) Gelen isteğin method'una göre favori ekleme veya silme yap
      if (req.method === 'POST') {
        // Favoriye ekleme işlemi
        if (!user.favorites.map(f => f.toString()).includes(productId.toString())) {
          await user.addFavorite(productId);
        }
      } else if (req.method === 'DELETE') {
        // Favoriden çıkarma işlemi
        if (user.favorites.map(f => f.toString()).includes(productId.toString())) {
          await user.removeFavorite(productId);
        }
      }
  
      // 4) İstek başarılı olduysa 200 döndür
      return res.status(200).json({ message: 'Success' });
    } catch (error) {
      // Bir hata olursa hata yönetimi
      next(error);
    }
}

module.exports = {
    addAddress,
    editAddress,
    updateAddress,
    deleteAddress,
    toggleFavorite
};
