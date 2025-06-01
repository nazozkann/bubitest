const express = require('express');
const User = require('../models/user-model'); // Kullanıcı modelini içe aktar
const authController = require('../controllers/auth-controller'); // Kimlik doğrulama işlemleri
const checkAuthStatus = require('../middlewares/check-auth'); // Kimlik kontrolü için middleware
const userController = require('../controllers/user-controller'); // Kullanıcı işlemleri
const Product = require('../models/product-model'); // Ürün modeli

const router = express.Router();

// Kayıt olma sayfasını görüntüle
router.get('/signup', authController.getSignup);

// Kayıt olma işlemini gerçekleştir
router.post('/signup', authController.signup);

// Giriş yapma sayfasını görüntüle
router.get('/signin', authController.getSignin);

// Giriş yapma işlemini gerçekleştir
router.post('/signin', authController.signin);

// Çıkış yapma işlemi
router.post('/logout', authController.logout);

// Favori ürünler sayfasını görüntüle
router.get('/profile/favorites', checkAuthStatus, async (req, res, next) => {
  try {
    if (!res.locals.isAuth) {
      return res.redirect('/signup');
    }

    const userId = req.session.user.id;
    const user = await User.findById(userId);

    // Kullanıcının favorilerine ekli ürünleri getir
    const favoriteProducts = await Product.findByIds(user.favorites);

    res.render('customer/profile/favorites', {
      user,
      favorites: favoriteProducts,
    });
  } catch (error) {
    console.error('Hata:', error);
    next(error); // Hata middleware'ine yönlendir
  }
});

// Kullanıcının adreslerini görüntüle
router.get('/profile/addresses', checkAuthStatus, async (req, res, next) => {
  try {
    if (!res.locals.isAuth) {
      return res.redirect('/signup');
    }

    const userId = req.session.user.id;
    const user = await User.findById(userId);

    res.render('customer/profile/addresses', {
      user,
      addresses: user.address || [], // Kullanıcının adres bilgilerini aktar ve varsayılan olarak boş dizi kullan
      csrfToken: req.csrfToken()
    });
  } catch (error) {
    console.error('Hata:', error);
    next(error); // Hata middleware'ine yönlendir
  }
});

// Favori ürün ekleme/çıkarma işlemi
// Tek seferde hem POST hem DELETE tanımı:
router
  .route('/favorites')
  .post(checkAuthStatus, userController.toggleFavorite)
  .delete(checkAuthStatus, userController.toggleFavorite);

module.exports = router;