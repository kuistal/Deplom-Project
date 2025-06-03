document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const checkoutButton = document.getElementById('checkout-btn');

    // Восстанавливаем тёмный режим
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
        darkModeIcon.classList.remove('bi-brightness-high');
        darkModeIcon.classList.add('bi-moon');
    }

    const darkModeToggle = document.getElementById('darkModeToggle');
    const darkModeIcon = document.getElementById('darkModeIcon');
    if (darkModeToggle && darkModeIcon) {
        darkModeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            if (document.body.classList.contains('dark-mode')) {
                darkModeIcon.classList.remove('bi-brightness-high');
                darkModeIcon.classList.add('bi-moon');
                localStorage.setItem('darkMode', 'enabled');
            } else {
                darkModeIcon.classList.remove('bi-moon');
                darkModeIcon.classList.add('bi-brightness-high');
                localStorage.setItem('darkMode', 'disabled');
            }
        });
    }

    // Функция для отображения товаров в корзине
    function displayCart() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        cartItemsContainer.innerHTML = '';

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Ваша корзина пуста. Добавьте товары на странице товара!</p>';
            cartTotalElement.textContent = '₽ 0';
            checkoutButton.disabled = true; // Отключаем кнопку "Оформить заказ", если корзина пуста
            return;
        }

        checkoutButton.disabled = false; // Активируем кнопку, если есть товары
        let total = 0;

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;

            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            let imgSrc = item.image;
            if (
                !/^https?:\/\//.test(imgSrc) &&
                !imgSrc.startsWith('../') &&
                !imgSrc.startsWith('assets/') &&
                !imgSrc.startsWith('/assets/') &&
                !imgSrc.startsWith('/bookimages/') &&
                !imgSrc.startsWith('/')
            ) {
                imgSrc = '../assets/image/' + imgSrc;
            }
            cartItem.innerHTML = `
                <img src="${imgSrc}" alt="${item.title}" onerror="this.src='../bookpage/placeholder.jpg';">
                <div class="cart-item-details">
                    <h3>${item.title}</h3>
                    <p>Автор: ${item.author}</p>
                    <p>Цена: ₽ ${item.price}</p>
                    <p>Количество: ${item.quantity}</p>
                    <p>Итого: ₽ ${itemTotal}</p>
                    <button class="remove-btn" data-id="${item.id}">Удалить</button>
                </div>
            `;
            cartItemsContainer.appendChild(cartItem);
        });

        cartTotalElement.textContent = `₽ ${total}`;
    }

    // ВЫЗЫВАЕМ отображение корзины при загрузке страницы!
    displayCart();

    checkoutButton.addEventListener('click', () => {
        window.location.href = 'checkout.html';
    });

    cartItemsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-btn')) {
            const id = e.target.getAttribute('data-id');
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            cart = cart.filter(item => String(item.id) !== String(id));
            localStorage.setItem('cart', JSON.stringify(cart));
            displayCart();
        }
    });
});