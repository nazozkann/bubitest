const updateOrderFormElements = document.querySelectorAll(
  '.order-actions form'
);

async function updateOrder(event) {
  event.preventDefault();
  const form = event.target;

  const formData = new FormData(form);
  const newStatus = formData.get('status');
  const orderId = formData.get('orderid');
  const csrfToken = formData.get('_csrf');

  let response;

  try {
    response = await fetch(`/admin/orders/${orderId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        newStatus: newStatus,
        _csrf: csrfToken,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Fetch error:', error); // Hata detaylarını konsola yaz
    alert('Something went wrong - could not update order status.');
    return;
  }

  if (!response.ok) {
    alert('Something went wrong - could not update order status.');
    return;
  }

  const responseData = await response.json();

  const badgeElement = form
    .closest('.order-item')
    .querySelector('.status-info'); // Changed selector from '.badge' to '.status-info'

  if (badgeElement) {
    badgeElement.textContent = responseData.newStatus.toUpperCase();
  } else {
    console.warn('Badge element not found');
  }
}

// Tüm form elemanlarına `submit` dinleyicisi ekleniyor
for (const updateOrderFormElement of updateOrderFormElements) {
  updateOrderFormElement.addEventListener('submit', updateOrder);
}