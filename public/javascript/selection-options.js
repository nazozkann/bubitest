// Tüm custom-category-select öğelerini seç
const categorySelects = document.querySelectorAll('.custom-category-select');

// Her bir custom-category-select için bağımsız olarak işlem yap
categorySelects.forEach((categorySelect) => {
  const selectedCategory = categorySelect.querySelector('.selected-category');
  const options = categorySelect.querySelectorAll('.category-option');
  const categoryOptions = categorySelect.querySelector('.category-options');

  // Seçim yapıldığında
  options.forEach(option => {
    option.addEventListener('click', (e) => {
      e.stopPropagation(); // Diğer tıklama olaylarını durdur
      const text = option.querySelector('p').textContent;

      // Seçili kategori alanını güncelle
      selectedCategory.querySelector('span').textContent = text;

      // Menü kapat
      categorySelect.classList.remove('open');
    });
  });

  // Açılır listeyi aç/kapat
  selectedCategory.addEventListener('click', (e) => {
    e.stopPropagation(); // Diğer tıklama olaylarını durdur
    categorySelect.classList.toggle('open');
  });
});

// Tıklama dışındaki yerlere basıldığında menüleri kapat
document.addEventListener('click', () => {
  categorySelects.forEach((categorySelect) => {
    categorySelect.classList.remove('open');
  });
});

document.addEventListener('DOMContentLoaded', () => {
    // Handle size selection
    const sizeOptions = document.querySelectorAll('.size-category .category-option');
    const selectedSizeInput = document.getElementById('selected-size');

    sizeOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Remove 'selected' class from all size options
            sizeOptions.forEach(opt => opt.classList.remove('selected'));
            // Add 'selected' class to the clicked option
            option.classList.add('selected');
            // Update the hidden input with the selected size
            selectedSizeInput.value = option.getAttribute('data-value');
        });
    });

    // Handle color selection
    const colorOptions = document.querySelectorAll('.color-category .category-option');
    const selectedColorInput = document.getElementById('selected-color');

    colorOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Remove 'selected' class from all color options
            colorOptions.forEach(opt => opt.classList.remove('selected'));
            // Add 'selected' class to the clicked option
            option.classList.add('selected');
            // Update the hidden input with the selected color
            selectedColorInput.value = option.getAttribute('data-value');
        });
    });
});