document.addEventListener('DOMContentLoaded', () => {
    const image = localStorage.getItem('productImage');
    const title = localStorage.getItem('productTitle');
    const author = localStorage.getItem('productAuthor');
    const price = localStorage.getItem('productPrice');
    const oldPrice = localStorage.getItem('productOldPrice');
    const discount = localStorage.getItem('productDiscount');
    const description = localStorage.getItem('productDescription');

    document.getElementById('product-image').src = image;
    document.getElementById('product-title').textContent = title;
    document.getElementById('product-author').textContent = `Автор: ${author}`;
    document.getElementById('product-old-price').textContent = `₽ ${oldPrice}`;
    document.getElementById('product-new-price').textContent = `₽ ${price}`;
    document.getElementById('product-discount').textContent = `-${discount}%`;
    document.getElementById('product-description').textContent = description;

    // Восстанавливаем тёмный режим
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
        darkModeIcon.classList.remove('bi-brightness-high');
        darkModeIcon.classList.add('bi-moon');
    }

    const darkModeToggle = document.getElementById('darkModeToggle');
    const darkModeIcon = document.getElementById('darkModeIcon');
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

    // Функция для добавления товара в корзину
    const addToCart = () => {
        const product = {
            id: `${title}-${author}`, // Уникальный идентификатор на основе названия и автора
            image: image,
            title: title,
            author: author,
            price: parseFloat(price),
            quantity: 1
        };

        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingProductIndex = cart.findIndex(item => item.id === product.id);

        if (existingProductIndex !== -1) {
            // Если товар уже есть, увеличиваем количество
            cart[existingProductIndex].quantity += 1;
        } else {
            // Иначе добавляем новый товар
            cart.push(product);
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        alert('Товар добавлен в корзину!');
    };

    // Добавление товара в корзину при нажатии на "В корзину"
    document.querySelector('.add-to-cart-btn').addEventListener('click', () => {
        addToCart();
    });

    // Добавление товара в корзину и переход на страницу корзины при нажатии на "Купить"
    document.querySelector('.buy-btn').addEventListener('click', (e) => {
        e.preventDefault();
        addToCart();
        // Добавляем небольшую задержку, чтобы убедиться, что localStorage обновился
        setTimeout(() => {
            window.location.href = '../cartpage/cart.html';
        }, 100);
    });
    
    document.querySelector('.buy-btn').addEventListener('click', (e) => {
        e.preventDefault();
        addToCart();
        updateCartCount();
        window.location.href = '../cartpage/cart.html';
    });

});