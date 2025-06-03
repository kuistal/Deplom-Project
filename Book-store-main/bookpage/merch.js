async function fetchMerch() {
    try {
        const response = await fetch('http://localhost:3001/api/merch');
        if (!response.ok) throw new Error('Не удалось загрузить мерч');
        return await response.json();
    } catch (error) {
        console.error('Ошибка:', error);
        return [];
    }
}

let userFavorites = [];
async function getUserFavorites() {
    const token = localStorage.getItem('token');
    if (!token) return [];
    const res = await fetch('http://localhost:3001/api/favorites', {
        headers: { 'Authorization': 'Bearer ' + token }
    });
    if (!res.ok) return [];
    return await res.json();
}

async function toggleFavorite(merchId, btn) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Войдите в аккаунт!');
        return;
    }
    const res = await fetch('http://localhost:3001/api/favorites', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ bookId: merchId })
    });
    const data = await res.json();
    userFavorites = data.favorites;
    btn.classList.toggle('fav-active', userFavorites.includes(merchId));
}

async function displayMerch(merchList) {
    // Сортировка по алфавиту, как у книг
    merchList.sort((a, b) => a.title.localeCompare(b.title, 'ru'));
    const container = document.getElementById('merch-cards');
    container.innerHTML = '';
    if (!merchList || merchList.length === 0) {
        container.innerHTML = '<p class="no-books">Мерч не найден</p>';
        return;
    }
    userFavorites = await getUserFavorites();
    merchList.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card1';
        let imgSrc = item.image ? item.image.replace(/^.*merchimages[\\\/]/, '/merchimages/') : '/bookpage/placeholder.jpg';
        // Кнопка избранного
        const favBtn = document.createElement('button');
        favBtn.className = `fav-btn${userFavorites.includes(item.id) ? ' fav-active' : ''}`;
        favBtn.innerHTML = '<i class="bi bi-heart-fill"></i>';
        favBtn.onclick = (e) => {
            e.stopPropagation();
            toggleFavorite(item.id, favBtn);
        };
        card.appendChild(favBtn);
        card.innerHTML += `
            <img src="${imgSrc}" alt="${item.title}" onerror="this.src='/bookpage/placeholder.jpg';" class="card-image">
            <div class="price-section">
                <span class="new-price">₽ ${item.price}</span>
            </div>
            <p>${item.title}</p>
            <div class="description-short" style="font-size:0.95em;color:#555;margin:8px 0 0 0;min-height:40px;">${item.description ? item.description.substring(0, 100) + (item.description.length > 100 ? '...' : '') : ''}</div>
            <div class="sec">
                <a href="#" class="buy-merch">Купить</a>
            </div>
        `;
        // Переход на страницу товара мерча (используем product.html)
        card.addEventListener('click', function() {
            localStorage.setItem('productId', item.id);
            localStorage.setItem('productType', 'merch');
            localStorage.setItem('productImage', imgSrc);
            localStorage.setItem('productTitle', item.title);
            localStorage.setItem('productAuthor', '');
            localStorage.setItem('productPrice', item.price);
            localStorage.setItem('productOldPrice', '');
            localStorage.setItem('productDiscount', '');
            localStorage.setItem('productDescription', item.description || 'Описание отсутствует');
            window.location.href = '../product/product.html';
        });
        // Добавление в корзину
        card.querySelector('.buy-merch').addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const product = {
                id: `${item.title}`,
                image: imgSrc,
                title: item.title,
                author: '',
                price: parseFloat(item.price),
                quantity: 1
            };
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            const existingProductIndex = cart.findIndex(i => i.id === product.id);
            if (existingProductIndex !== -1) {
                cart[existingProductIndex].quantity += 1;
            } else {
                cart.push(product);
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            window.location.href = '../cartpage/cart.html';
        });
        container.appendChild(card);
    });
}

async function populateMerchTypes(merchList) {
    const typeSelect = document.getElementById('merch-type');
    if (!typeSelect) return;
    // Собираем уникальные типы из merchList
    const typesSet = new Set();
    merchList.forEach(item => {
        if (item.filters) {
            let arr = Array.isArray(item.filters) ? item.filters : item.filters.split(',');
            arr.forEach(type => typesSet.add(type.trim()));
        }
    });
    // Очищаем и добавляем опции
    typeSelect.innerHTML = '<option value="">Все типы</option>';
    Array.from(typesSet).sort().forEach(type => {
        if (type)
            typeSelect.innerHTML += `<option value="${type}">${type}</option>`;
    });
}

async function filterMerch() {
    const type = document.getElementById('merch-type').value.toLowerCase();
    const merchList = await fetchMerch();
    const filtered = type === '' ? merchList : merchList.filter(item => {
        let arr = Array.isArray(item.filters) ? item.filters : (item.filters ? item.filters.split(',') : []);
        return arr.map(t => t.trim().toLowerCase()).includes(type);
    });
    displayMerch(filtered);
}

// Инициализация: загружаем мерч, заполняем типы и выводим карточки
fetchMerch().then(merchList => {
    populateMerchTypes(merchList);
    displayMerch(merchList);
}); 