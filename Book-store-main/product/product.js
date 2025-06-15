document.addEventListener('DOMContentLoaded', () => {
    const image = localStorage.getItem('productImage');
    const title = localStorage.getItem('productTitle');
    const author = localStorage.getItem('productAuthor');
    const price = localStorage.getItem('productPrice');
    const oldPrice = localStorage.getItem('productOldPrice');
    const discount = localStorage.getItem('productDiscount');
    const description = localStorage.getItem('productDescription');
    const productId = localStorage.getItem('productId');

    console.log('productImage from localStorage:', image);
    let imgSrc = image ? image.replace(/^.*bookimages[\\/]/, '/bookimages/') : '/bookpage/placeholder.jpg';
    console.log('imgSrc for product image:', imgSrc);
    const productImage = document.getElementById('product-image');
    productImage.src = imgSrc;
    productImage.onerror = function() {
        if (this.src.indexOf('placeholder.jpg') === -1) {
            this.src = '/bookpage/placeholder.jpg';
        } else {
            this.onerror = null;
        }
    };
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

    // Функция для добавления товара в корзину
    const addToCart = () => {
        const product = {
            id: `${title}-${author}`,
            product_id: productId,
            product_type: localStorage.getItem('productType') || 'book',
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
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            addToCart();
        });
    }

    // Добавление товара в корзину и переход на страницу корзины при нажатии на "Купить"
    const buyBtn = document.querySelector('.buy-btn');
    if (buyBtn) {
        buyBtn.addEventListener('click', (e) => {
            e.preventDefault();
            addToCart();
            updateCartCount && updateCartCount();
            window.location.href = '../cartpage/cart.html';
        });
    }

    // --- Избранное ---
    const favBtn = document.getElementById('favProductBtn');
    let bookId = productId;
    async function updateFavBtn() {
        const token = localStorage.getItem('token');
        if (!token || !bookId) return;
        const res = await fetch('http://217.198.13.177/api/favorites', {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        if (!res.ok) return;
        const favorites = await res.json();
        if (favorites.includes(bookId)) {
            favBtn.classList.add('fav-active');
        } else {
            favBtn.classList.remove('fav-active');
        }
    }
    favBtn.addEventListener('click', async function() {
        const token = localStorage.getItem('token');
        if (!token || !bookId) {
            alert('Войдите в аккаунт!');
            return;
        }
        const res = await fetch('http://217.198.13.177/api/favorites', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ bookId })
        });
        const data = await res.json();
        if (data.favorites && data.favorites.includes(bookId)) {
            favBtn.classList.add('fav-active');
        } else {
            favBtn.classList.remove('fav-active');
        }
    });
    updateFavBtn();

    // --- Рейтинг и отзывы ---
    const userId = localStorage.getItem('userId'); // предполагается, что userId есть в localStorage после авторизации
    loadProductReviews();
    // Инициализация звёзд для формы
    productStars = document.querySelectorAll('#product-review-form .star');
    productStars.forEach((star, idx) => {
        star.addEventListener('click', () => rateProduct(idx + 1));
    });
    const reviewBtn = document.getElementById('product-review-submit');
    if (reviewBtn) {
        reviewBtn.addEventListener('click', submitProductReview);
    }

    // Загрузка похожих товаров
    loadSimilarProducts();
});

function rateProduct(n) {
    removeProductStars();
    let colors = ["red", "orange", "yellow", "gold", "green"];
    for (let i = 0; i < n; i++) {
        productStars[i].style.color = colors[n - 1];
    }
    document.getElementById("product-rating-output").innerText = "Рейтинг: " + n + "/5";
    document.getElementById("product-selected-rating").value = n;
}
function removeProductStars() {
    productStars.forEach(star => star.style.color = "gray");
}

async function loadProductReviews() {
    const productId = localStorage.getItem('productId');
    const productType = localStorage.getItem('productType') || 'book';
    console.log('productId:', productId, 'productType:', productType);
    const reviewsList = document.getElementById('product-reviews-list');
    const ratingDisplay = document.getElementById('product-rating-display');
    reviewsList.innerHTML = '';
    ratingDisplay.innerHTML = '';
    try {
        const res = await fetch(`http://217.198.13.177/api/reviews/${productType}/${productId}`);
        const data = await res.json();
        console.log('data:', data);
        if (!data.reviews || data.reviews.length === 0) {
            reviewsList.innerHTML = '<p>Пока нет отзывов.</p>';
            ratingDisplay.innerHTML = '<p>Средний рейтинг: 0/5</p>';
            return;
        }
        ratingDisplay.innerHTML = `<h4>Средний рейтинг: ${data.avg_rating ? Number(data.avg_rating).toFixed(1) : 0} / 5 (${data.review_count})</h4>`;
        data.reviews.forEach(review => {
            let div = document.createElement('div');
            div.classList.add('review-item');
            let avatar = document.createElement('div');
            avatar.className = 'review-avatar';
            avatar.textContent = (review.username ? review.username[0].toUpperCase() : 'U');
            let content = document.createElement('div');
            content.className = 'review-content';
            content.innerHTML = `
                <strong>${review.username || 'User'}</strong>
                <span class="review-rating-stars">${getColoredStars(review.rating)}</span>
                <em>${new Date(review.created_at).toLocaleString()}</em>
                <p>${review.review_text}</p>
            `;
            div.appendChild(avatar);
            div.appendChild(content);
            reviewsList.appendChild(div);
        });
    } catch (e) {
        reviewsList.innerHTML = '<p>Ошибка загрузки отзывов.</p>';
    }
}

async function submitProductReview() {
    const productId = localStorage.getItem('productId');
    const productType = localStorage.getItem('productType') || 'book';
    const userId = localStorage.getItem('userId');
    let reviewText = document.getElementById('product-review-text').value.trim();
    let rating = parseInt(document.getElementById('product-selected-rating').value);
    console.log('book_id:', productId, 'user_id:', userId, 'rating:', rating, 'review_text:', reviewText, 'type:', productType);
    if (reviewText === '' || rating === 0) {
        alert('Пожалуйста, напишите отзыв и выберите рейтинг.');
        return;
    }
    try {
        const res = await fetch('http://217.198.13.177/api/reviews', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                book_id: productId,
                user_id: userId,
                rating: rating,
                review_text: reviewText,
                type: productType
            })
        });
        const data = await res.json();
        if (data.success) {
            document.getElementById('product-review-text').value = '';
            document.getElementById('product-selected-rating').value = '0';
            document.getElementById('product-rating-output').innerText = 'Рейтинг: 0/5';
            removeProductStars();
            loadProductReviews();
        } else {
            alert('Ошибка при добавлении отзыва');
        }
    } catch (e) {
        alert('Ошибка при добавлении отзыва');
    }
}

function getColoredStars(rating) {
    let colors = ["red", "orange", "yellow", "gold", "green"];
    let stars = "";
    for (let i = 0; i < 5; i++) {
        if (i < rating) {
            stars += `<span style="color:${colors[rating - 1]}; font-size:20px;">★</span>`;
        } else {
            stars += `<span style="color:gray; font-size:20px;">★</span>`;
        }
    }
    return stars;
}

async function loadSimilarProducts() {
    const productId = localStorage.getItem('productId');
    const productType = localStorage.getItem('productType') || 'book';
    const container = document.getElementById('similar-list');
    if (!container || !productId) return;
    container.innerHTML = '<div style="color:#888;">Загрузка похожих товаров...</div>';
    try {
        const res = await fetch(`/api/products/${productType}/${productId}/similar`);
        const products = await res.json();
        container.innerHTML = '';
        if (!products.length) {
            container.innerHTML = '<div style="color:#888;">Похожие товары не найдены</div>';
            return;
        }
        // Разделяем на книги и мерч
        const books = products.filter(p => p.type === 'book').slice(0, 2);
        const merch = products.filter(p => p.type === 'merch').slice(0, 2);
        const toShow = [...books, ...merch];
        // Центрируем карточки
        container.style.justifyContent = 'center';
        container.style.display = 'flex';
        container.style.gap = '40px';
        container.style.flexWrap = 'wrap';
        toShow.forEach(prod => {
            let imgSrc = prod.image || '/bookpage/placeholder.jpg';
            if (prod.type === 'book') {
                imgSrc = imgSrc.replace(/^.*bookimages[\\/]/, '/bookimages/');
            } else {
                imgSrc = imgSrc.replace(/^.*merchimages[\\/]/, '/merchimages/');
            }
            const card = document.createElement('div');
            card.className = 'similar-card';
            card.style = `width:320px; min-height:500px; border-radius:22px; box-shadow:0 8px 32px #0002; padding:28px 18px 28px 18px; background:#fff; text-align:center; cursor:pointer; border: none; transition:box-shadow 0.2s; display:flex; flex-direction:column; align-items:center; justify-content:flex-start;`;
            card.innerHTML = `
                <div style='width:100%;height:280px;display:flex;align-items:center;justify-content:center;background:#fff;border-radius:18px;padding:0;'>
                    <img src="${imgSrc}" alt="${prod.title}" style="max-width:100%;max-height:100%;object-fit:contain;border-radius:18px;background:#fff;">
                </div>
                <div class="similar-title" style="font-weight:bold;margin:24px 0 14px;font-size:1.22em;min-height:54px;display:flex;align-items:center;justify-content:center;">${prod.title}</div>
                <div class="similar-price" style="color:#4F3076;margin-bottom:28px;font-size:1.18em;">${prod.price} ₽</div>
                <a href="#" class="btn" style="background:#8E3796;color:#fff;padding:14px 0;border-radius:10px;text-decoration:none;font-size:18px;width:100%;max-width:200px;align-self:center;">Подробнее</a>
            `;
            card.querySelector('.btn').onclick = (e) => {
                e.preventDefault();
                localStorage.setItem('productId', prod.id);
                localStorage.setItem('productType', prod.type);
                localStorage.setItem('productImage', imgSrc);
                localStorage.setItem('productTitle', prod.title);
                localStorage.setItem('productAuthor', prod.author || '');
                localStorage.setItem('productPrice', prod.price);
                localStorage.setItem('productOldPrice', '');
                localStorage.setItem('productDiscount', '');
                localStorage.setItem('productDescription', prod.description || 'Описание отсутствует');
                window.location.href = 'product.html';
            };
            card.onclick = () => {
                localStorage.setItem('productId', prod.id);
                localStorage.setItem('productType', prod.type);
                localStorage.setItem('productImage', imgSrc);
                localStorage.setItem('productTitle', prod.title);
                localStorage.setItem('productAuthor', prod.author || '');
                localStorage.setItem('productPrice', prod.price);
                localStorage.setItem('productOldPrice', '');
                localStorage.setItem('productDiscount', '');
                localStorage.setItem('productDescription', prod.description || 'Описание отсутствует');
                window.location.href = 'product.html';
            };
            container.appendChild(card);
        });
        // Увеличить заголовок 'Похожие товары'
        const similarHeader = document.querySelector('.similar-products h3');
        if (similarHeader) {
            similarHeader.style.fontSize = '2em';
            similarHeader.style.fontWeight = 'bold';
            similarHeader.style.marginBottom = '24px';
        }
    } catch (e) {
        container.innerHTML = '<div style="color:#e63946;">Ошибка загрузки похожих товаров</div>';
    }
}