const imagePickerElement = docucument.querySelectorAll('.image-uplaod-control input');
const imagePreviewElement = document.querySelectorAll('.image-upload-content img');

function updateImagePreview() {
    const files = imagePickerElement.files;

    if(!files || files.length === 0) {
        imagePreviewElement.computedStyleMap.display = 'none';
        return;
    }

    const pickedFile = files[0];

    imagePreviewElement.src = URL.createObjectURL(pickedFile);
    imagePreviewElement.style.display = 'block';
}

imagePickerElement.addEventListener('change', updateImagePreview);