const express = require('express');
const Design = require('../models/design-model');
const designController = require('../controllers/design-controller');
const designImageUploadMiddleware = require('../middlewares/design-image-upload');

const router = express.Router();

router.get('/design', function(req, res) {
    const designId = 'someUniqueDesignId'; // Replace with actual design ID logic
    res.render('customer/products/design', { designId: designId });
});

router.get('/design/items/:id', designController.getDesignById); // Added route for fetching design by ID

router.post('/design/items',
    designImageUploadMiddleware.fields([
        { name: 'designImageFront', maxCount: 1 },
        { name: 'designImageBack', maxCount: 1 }
    ]),
    designController.saveDesign
);

module.exports = router;