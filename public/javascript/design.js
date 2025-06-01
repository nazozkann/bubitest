document.addEventListener('DOMContentLoaded', function () {
    setupImageUpload('front');
    setupImageUpload('back');

    document.getElementById('front-btn').addEventListener('click', function () {
        document.getElementById('image-upload-back').style.display = 'block';
        document.getElementById('image-upload-front').style.display = 'none';
        updateZIndex('back');
    });

    document.getElementById('back-btn').addEventListener('click', function () {
        document.getElementById('image-upload-front').style.display = 'block';
        document.getElementById('image-upload-back').style.display = 'none';
        updateZIndex('front');
    });

    const designForm = document.getElementById('design-form');
    const addToChartButton = document.getElementById('add-to-chart-design');

    addToChartButton.addEventListener('click', function (event) {
        event.preventDefault(); 
        console.log('Button clicked. Sending form data.');

        const selectedColor = document.querySelector('input[name="color"]:checked');
        const frontImage = document.querySelector('#uploaded-image-container-front img');
        const backImage = document.querySelector('#uploaded-image-container-back img');

        if (!selectedColor || (!frontImage && !backImage)) {
            alert('Please select a color and upload at least one image.');
        } else {
            designForm.submit();
        }
    });

    function setupImageUpload(side) {
        const uploadTrigger = document.getElementById(`upload-trigger-${side}`);
        const fileInput = document.getElementById(`file-input-${side}`);
        const container = document.getElementById(`uploaded-image-container-${side}`);
        const designBorder = document.getElementById(`${side}-border`);
        const uploadInfo = document.querySelector(`.upload-image-bottom-info-${side}`);
        const resizeHandleClass = `resize-handle-${side}`;

        uploadTrigger.addEventListener('click', function () {
            fileInput.click();
        });

        fileInput.addEventListener('change', function (event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.className = `uploaded-image-${side}`;
                    img.style.width = '50%';
                    img.style.height = 'auto';
                    img.style.position = 'absolute';
                    img.style.top = '0';
                    img.style.left = '0';
        
                    container.innerHTML = '';
                    container.appendChild(img);
        
                    const resizeHandle = document.createElement('div');
                    resizeHandle.className = resizeHandleClass;
                    container.appendChild(resizeHandle);

                    // Add close button
                    const closeButton = document.createElement('div');
                    closeButton.className = 'close-button';
                    closeButton.innerHTML = '&times;';
                    closeButton.style.position = 'absolute';
                    closeButton.style.cursor = 'pointer';
                    closeButton.style.zIndex = '10';
                    container.appendChild(closeButton);

                    closeButton.addEventListener('click', function () {
                        container.innerHTML = '';
                        if (uploadInfo) {
                            uploadInfo.style.display = 'block';
                        }
                        updatePrice();
                        // Temizlerken hidden input’ları da resetliyoruz
                        resetCoordinates(side);
                    });
        
                    img.onload = function () {
                        if (img.offsetWidth === 0 || img.offsetHeight === 0) {
                            console.warn('Image has no dimensions, forcing reflow...');
                            forceRepaint(img);
                        }

                        // Varsayılan ilk değerlere set et (left=0, top=0, width=yarısı)
                        setCoordinates(side, 0, 0, img.offsetWidth, img.offsetHeight);

                        updateResizeHandlePosition(img, resizeHandle);
                        updateCloseButtonPosition(img, closeButton);
                        addDragFunctionality(img, resizeHandle, closeButton, designBorder, side);
                        addResizeFunctionality(img, resizeHandle, closeButton, designBorder, side);

                        const uploadText = uploadInfo.querySelector('.upload-text');
                        if (uploadText) {
                            uploadText.style.display = 'none';
                        }

                        const directionBtn = document.querySelector(`.${side}-btn`);
                        if (directionBtn) {
                            directionBtn.style.display = 'block';
                            directionBtn.style.marginTop = '3.2rem';
                        }
        
                        updateZIndex(side);
                        updatePrice();
                    };
                };
                reader.readAsDataURL(file);
            }
        });
    }

    function resetCoordinates(side) {
        if (side === 'front') {
            document.getElementById('front-left').value = '';
            document.getElementById('front-top').value = '';
            document.getElementById('front-width').value = '';
            document.getElementById('front-height').value = '';
        } else {
            document.getElementById('back-left').value = '';
            document.getElementById('back-top').value = '';
            document.getElementById('back-width').value = '';
            document.getElementById('back-height').value = '';
        }
    }

    function setCoordinates(side, left, top, width, height) {
        if (side === 'front') {
            document.getElementById('front-left').value = left;
            document.getElementById('front-top').value = top;
            document.getElementById('front-width').value = width;
            document.getElementById('front-height').value = height;
        } else {
            document.getElementById('back-left').value = left;
            document.getElementById('back-top').value = top;
            document.getElementById('back-width').value = width;
            document.getElementById('back-height').value = height;
        }
    }

    function forceRepaint(element) {
        const display = element.style.display;
        element.style.display = 'none';
        element.offsetHeight; // Trigger reflow
        element.style.display = display;
    }

    function updateResizeHandlePosition(img, resizeHandle) {
        resizeHandle.style.top = `${img.offsetTop + img.offsetHeight - 10}px`;
        resizeHandle.style.left = `${img.offsetLeft + img.offsetWidth - 10}px`;
    }

    function updateCloseButtonPosition(img, closeButton) {
        closeButton.style.top = `${img.offsetTop}px`;
        closeButton.style.left = `${img.offsetLeft}px`;
    }

    function addDragFunctionality(img, resizeHandle, closeButton, designBorder, side) {
        let startX = 0, startY = 0, offsetX = 0, offsetY = 0, isDragging = false;

        img.addEventListener('mousedown', function (e) {
            e.preventDefault();
            startX = e.clientX;
            startY = e.clientY;
            offsetX = parseInt(img.style.left || 0, 10);
            offsetY = parseInt(img.style.top || 0, 10);

            isDragging = true;

            document.addEventListener('mousemove', mouseMove);
            document.addEventListener('mouseup', mouseUp);
        });

        function mouseMove(e) {
            if (!isDragging) return;

            const rect = designBorder.getBoundingClientRect();

            let newLeft = offsetX + (e.clientX - startX);
            let newTop = offsetY + (e.clientY - startY);

            newLeft = Math.max(0, Math.min(newLeft, rect.width - img.offsetWidth));
            newTop = Math.max(0, Math.min(newTop, rect.height - img.offsetHeight));

            img.style.left = `${newLeft}px`;
            img.style.top = `${newTop}px`;

            updateResizeHandlePosition(img, resizeHandle);
            updateCloseButtonPosition(img, closeButton);

            // Hidden input’lara kaydet
            setCoordinates(side, newLeft, newTop, img.offsetWidth, img.offsetHeight);
        }

        function mouseUp() {
            isDragging = false;
            document.removeEventListener('mousemove', mouseMove);
            document.removeEventListener('mouseup', mouseUp);
        }
    }

    function addResizeFunctionality(img, resizeHandle, closeButton, designBorder, side) {
        let startX = 0, startWidth = 0;
        const aspectRatio = img.offsetWidth / img.offsetHeight;
        let isResizing = false;

        resizeHandle.addEventListener('mousedown', function (e) {
            e.preventDefault();
            startX = e.clientX;
            startWidth = img.offsetWidth;
            isResizing = true;

            document.addEventListener('mousemove', mouseMove);
            document.addEventListener('mouseup', mouseUp);
        });

        function mouseMove(e) {
            if (!isResizing) return;

            const rect = designBorder.getBoundingClientRect();
            const widthChange = e.clientX - startX;
            const newWidth = Math.max(50, startWidth + widthChange); // Minimum width: 50px
            const newHeight = newWidth / aspectRatio;

            if (
                img.offsetLeft + newWidth <= rect.width &&
                img.offsetTop + newHeight <= rect.height
            ) {
                img.style.width = `${newWidth}px`;
                img.style.height = `${newHeight}px`;

                updateResizeHandlePosition(img, resizeHandle);
                updateCloseButtonPosition(img, closeButton);

                // Hidden input’lara kaydet
                const leftVal = parseInt(img.style.left, 10);
                const topVal = parseInt(img.style.top, 10);
                setCoordinates(side, leftVal, topVal, newWidth, newHeight);
            }
        }

        function mouseUp() {
            isResizing = false;
            document.removeEventListener('mousemove', mouseMove);
            document.removeEventListener('mouseup', mouseUp);
        }
    }

    function updateZIndex(side) {
        const frontContainer = document.getElementById('uploaded-image-container-front');
        const backContainer = document.getElementById('uploaded-image-container-back');
        if (side === 'front') {
            frontContainer.style.zIndex = '10';
            backContainer.style.zIndex = '5';
        } else {
            frontContainer.style.zIndex = '5';
            backContainer.style.zIndex = '10';
        }
    }

    function updatePrice() {
        const frontImage = document.querySelector('#uploaded-image-container-front img');
        const backImage = document.querySelector('#uploaded-image-container-back img');
        const priceElement = document.querySelector('.design-price');
        let price = 0;

        if (frontImage || backImage) price = 500;
        if (backImage && frontImage) price = 800;

        if (price > 0) {
            priceElement.style.display = 'block';
            priceElement.querySelector('#price-info').innerText = price;
        } else {
            priceElement.style.display = 'none';
        }
    }

    // Initial call to hide the price element
    updatePrice();
});