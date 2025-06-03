document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('checkout-form');
    const successBlock = document.getElementById('checkout-success');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        const formData = new FormData(form);
        const address = {
            city: formData.get('city'),
            street: formData.get('street'),
            house: formData.get('house'),
            apartment: formData.get('apartment'),
            postal_code: formData.get('postal_code')
        };
        // Данные карты не отправляем на сервер, только имитируем процесс
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const user = JSON.parse(localStorage.getItem('user'));
        if (!cart.length || !user) {
            alert('Корзина пуста или вы не авторизованы!');
            return;
        }
        const orderData = {
            user_id: user.id,
            address,
            items: cart
        };
        const res = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });
        if (res.ok) {
            localStorage.removeItem('cart');
            form.style.display = 'none';
            successBlock.style.display = 'block';
        } else {
            alert('Ошибка при оформлении заказа!');
        }
    });
}); 