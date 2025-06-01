const express = require('express');

const authController = require('../controllers/auth-controller');

const router = express.Router();

router.get('/', function(req, res) {
    res.render('customer/products/main-page');
});

router.get('/about', function(req, res) {
    res.render('customer/products/about');
});


router.get('/401', function(req, res) { // Added leading slash
    res.status(401).render('shared/401');
});

router.get('/403', function(req, res) { // Added leading slash
    res.status(403).render('shared/403');
});

module.exports = router;