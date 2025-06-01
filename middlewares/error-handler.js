function imageUploadErrorHandler(error, req, res, next) {
    // Multer tarafından tetiklenen hata kodlarını ele alıyoruz
    if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).render('shared/image-upload-error', {
            errorMessage: 'Dosya boyutu 500KB sınırını aşıyor.'
        });
    }

    if (error.message === 'Invalid mime type!') {
        return res.status(400).render('shared/image-upload-error', {
            errorMessage: 'You can upload only PNG, JPG and JPEG.'
        });
    }

    // Eğer hata resim yükleme ile ilgili değilse, sonraki hata handler'a yönlendir
    next(error);
}

function handleErrors(error, req, res, next) {
    console.log(error);

    if (error.statusCode === 404 || error.message === 'Not Found') {
        return res.status(404).render('shared/404');
    }

    res.status(500).render('shared/500');
}

module.exports = {
    imageUploadErrorHandler,
    handleErrors
};