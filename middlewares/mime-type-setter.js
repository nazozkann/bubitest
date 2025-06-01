const path = require('path');

function setMimeType(req, res, next) {
    if (req.path.endsWith('.css')) {
        res.setHeader('Content-Type', 'text/css');
    }
    next();
}

module.exports = setMimeType;