document.addEventListener('DOMContentLoaded', function () {
  const favIcons = document.querySelectorAll('.fav-icon');

  favIcons.forEach((favIcon) => {
    let isActive = favIcon.getAttribute('data-isfavorite') === 'true';

    // İlk yüklemede doğru ikonu göster
    favIcon.src = isActive
      ? '/images/fav-icon-active.png'
      : '/images/fav-icon-ligth.png';

    // Hover olayları
    favIcon.addEventListener('mouseover', function () {
      if (!isActive) {
        favIcon.src = '/images/fav-icon-hover.png';
      }
    });
  
    favIcon.addEventListener('mouseout', function () {
      if (!isActive) {
        favIcon.src = '/images/fav-icon-ligth.png';
      }
    });

    // Tıklama olayı
    favIcon.addEventListener('click', async function () {
      const isAuth = favIcon.getAttribute('data-isauth') === 'true';
      if (!isAuth) {
        window.location.href = '/signup'; // Giriş yapmamışsa yönlendir
        return;
      }

      const productId = favIcon.getAttribute('data-productid');
      const csrfToken = favIcon.previousElementSibling.value;

      try {
        // Favori durumu değiştirme isteği gönder:
        // Eğer isActive true ise "DELETE" isteği ile favoriden çıkar
        // Eğer isActive false ise "POST" isteği ile favoriye ekle
        const response = await fetch('/favorites', {
          method: isActive ? 'DELETE' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            'CSRF-Token': csrfToken,
          },
          body: JSON.stringify({ productId }),
        });

        if (response.ok) {
          // Sunucudan başarılı yanıt geldiyse front-end'de ikonu değiştir
          isActive = !isActive;
          favIcon.src = isActive
            ? '/images/fav-icon-active.png'
            : '/images/fav-icon-ligth.png';
        } else {
          console.error('Favori durumu güncellenemedi.');
        }
      } catch (error) {
        console.error('Sunucu hatası:', error);
      }
    });
  });
});