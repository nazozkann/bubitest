function imageUploadErrorHandler(error, req, res, next) {
    if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).render('shared/image-upload-error', {
            errorMessage: 'File cant be bigger than 2 MB.'
        });
    }

    if (error.message === 'Invalid mime type!') {
        return res.status(400).render('shared/image-upload-error', {
            errorMessage: 'You can upload only PNG, JPG and JPEG.'
        });
    }

    next(error);
}

module.exports = imageUploadErrorHandler;