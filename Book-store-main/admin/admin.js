// Переключение вкладок
const navLinks = document.querySelectorAll('.nav-link');
const sections = {
    dashboard: document.getElementById('dashboard-section'),
    users: document.getElementById('users-section'),
    products: document.getElementById('products-section'),
    reviews: document.getElementById('reviews-section'),
    'add-product': document.getElementById('add-product-section'),
    orders: document.getElementById('orders-section'),
};
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        Object.values(sections).forEach(sec => sec.style.display = 'none');
        sections[link.dataset.section].style.display = 'block';
        // Если выбрана вкладка пользователей — загружаем их
        if (link.dataset.section === 'users') {
            loadUsers();
        }
        // Если выбрана вкладка товаров — загружаем их
        if (link.dataset.section === 'products') {
            loadProducts('all');
        }
        if (link.dataset.section === 'reviews') {
            loadReviews();
        }
        if (link.dataset.section === 'add-product') {
            renderAddProductForm();
        }
        if (link.dataset.section === 'orders') {
            loadAdminOrders();
        }
    });
});

// Загрузка статистики с сервера
async function loadStats() {
    try {
        const res = await fetch('/api/admin/stats');
        if (!res.ok) throw new Error('Ошибка загрузки статистики');
        const stats = await res.json();
        document.getElementById('stat-users').textContent = stats.users;
        document.getElementById('stat-products').textContent = stats.products;
        document.getElementById('stat-reviews').textContent = stats.reviews;
    } catch (e) {
        document.getElementById('stat-users').textContent = '?';
        document.getElementById('stat-products').textContent = '?';
        document.getElementById('stat-reviews').textContent = '?';
    }
}
loadStats();
loadSalesStats();

// === Загрузка и отображение статистики продаж ===
async function loadSalesStats() {
    try {
        const res = await fetch('/api/admin/orders');
        if (!res.ok) throw new Error('Ошибка загрузки заказов');
        const orders = await res.json();
        console.log('DEBUG: orders for sales stats', orders); // временный вывод для отладки
        let totalSales = 0;
        for (const o of orders) {
            totalSales += o.items.reduce((sum, item) => sum + (item.quantity || 0), 0);
        }
        const statSales = document.getElementById('stat-sales');
        if (statSales) statSales.textContent = totalSales;
    } catch (e) {
        const statSales = document.getElementById('stat-sales');
        if (statSales) statSales.textContent = '?';
    }
}

// Загрузка и отображение пользователей
async function loadUsers() {
    const usersSection = document.getElementById('users-section');
    usersSection.innerHTML = '<div class="admin-loading">Загрузка...</div>';
    try {
        const res = await fetch('/api/admin/users');
        if (!res.ok) throw new Error('Ошибка загрузки пользователей');
        const users = await res.json();
        if (!users.length) {
            usersSection.innerHTML = '<p>Нет пользователей.</p>';
            return;
        }
        let html = `<table class="admin-table"><thead><tr><th>ID</th><th>Логин</th><th>Имя</th><th>Email</th><th>Роль</th><th>Действия</th></tr></thead><tbody>`;
        for (const u of users) {
            html += `<tr><td>${u.id}</td><td>${u.username}</td><td>${u.name}</td><td>${u.email}</td><td>${u.role}</td><td><button class='admin-user-delete-btn' data-id='${u.id}'>Удалить</button></td></tr>`;
        }
        html += '</tbody></table>';
        usersSection.innerHTML = html;
        // Навешиваем обработчики на кнопки удаления
        document.querySelectorAll('.admin-user-delete-btn').forEach(btn => {
            btn.addEventListener('click', async function() {
                const userId = this.dataset.id;
                if (confirm('Удалить пользователя #' + userId + '?')) {
                    const res = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' });
                    if (res.ok) {
                        loadUsers();
                    } else {
                        alert('Ошибка удаления пользователя');
                    }
                }
            });
        });
    } catch (e) {
        usersSection.innerHTML = '<div class="admin-error">Ошибка загрузки пользователей</div>';
    }
}

// Загрузка и отображение товаров
async function loadProducts(filterType = 'all') {
    const productsSection = document.getElementById('products-section');
    // Фильтр-кнопки
    productsSection.innerHTML = `
        <div style="margin-bottom:18px;display:flex;gap:12px;">
            <button class="admin-product-filter-btn" data-type="all">Все</button>
            <button class="admin-product-filter-btn" data-type="book">Книги</button>
            <button class="admin-product-filter-btn" data-type="merch">Мерч</button>
        </div>
        <div id="products-table-wrap"></div>
    `;
    const tableWrap = document.getElementById('products-table-wrap');
    tableWrap.innerHTML = '<div class="admin-loading">Загрузка...</div>';
    try {
        const res = await fetch('/api/admin/products');
        if (!res.ok) throw new Error('Ошибка загрузки товаров');
        let products = await res.json();
        if (filterType !== 'all') {
            products = products.filter(p => p.type === filterType);
        }
        if (!products.length) {
            tableWrap.innerHTML = '<p>Нет товаров.</p>';
            return;
        }
        let html = `<table class="admin-table"><thead><tr><th>ID</th><th>Название</th><th>Цена</th><th>Тип</th><th>Картинка</th><th>Действия</th></tr></thead><tbody>`;
        for (const p of products) {
            html += `<tr><td>${p.id}</td><td>${p.title}</td><td>${p.price}</td><td>${p.type === 'book' ? 'Книга' : 'Мерч'}</td><td><img src="${p.image}" alt="img" style="width:40px;height:60px;object-fit:cover;border-radius:4px;box-shadow:0 2px 6px #8E379633;"></td><td><button class='admin-product-edit-btn' data-id='${p.id}' data-type='${p.type}'>Редактировать</button> <button class='admin-product-delete-btn' data-id='${p.id}' data-type='${p.type}'>Удалить</button></td></tr>`;
        }
        html += '</tbody></table>';
        tableWrap.innerHTML = html;
        // Фильтр-кнопки обработчики
        document.querySelectorAll('.admin-product-filter-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                loadProducts(this.dataset.type);
            });
        });
        // Кнопки удаления
        document.querySelectorAll('.admin-product-delete-btn').forEach(btn => {
            btn.addEventListener('click', async function() {
                const id = this.dataset.id;
                const type = this.dataset.type;
                if (confirm('Удалить ' + (type === 'book' ? 'книгу' : 'мерч') + ' #' + id + '?')) {
                    const res = await fetch(`/api/admin/products/${type}/${id}`, { method: 'DELETE' });
                    if (res.ok) {
                        loadProducts(filterType);
                    } else {
                        alert('Ошибка удаления товара');
                    }
                }
            });
        });
        // Кнопки редактирования
        document.querySelectorAll('.admin-product-edit-btn').forEach(btn => {
            btn.addEventListener('click', async function() {
                const id = this.dataset.id;
                const type = this.dataset.type;
                // Получаем данные товара с сервера
                const res = await fetch(`/api/admin/products/${type}/${id}`);
                if (res.ok) {
                    const product = await res.json();
                    product.type = type;
                    showEditProductModal(product);
                } else {
                    alert('Ошибка загрузки товара');
                }
            });
        });
    } catch (e) {
        tableWrap.innerHTML = '<div class="admin-error">Ошибка загрузки товаров</div>';
    }
}

// Модальное окно для редактирования товара
function showEditProductModal(product) {
    // Создаём модалку, если её нет
    let modal = document.getElementById('editProductModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'editProductModal';
        modal.style.position = 'fixed';
        modal.style.left = '0';
        modal.style.top = '0';
        modal.style.width = '100vw';
        modal.style.height = '100vh';
        modal.style.background = 'rgba(0,0,0,0.35)';
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
        modal.style.zIndex = '9999';
        document.body.appendChild(modal);
    }
    // Форма для книги или мерча
    let extraFields = '';
    if (product.type === 'book') {
        extraFields = `
            <label>Автор:<input type='text' id='edit-author' value='${product.author || ''}'></label><br>
            <label>Жанры:<input type='text' id='edit-genres' value='${product.genres || ''}'></label><br>
            <label>Описание:<textarea id='edit-description'>${product.description || ''}</textarea></label><br>
        `;
    } else {
        extraFields = `
            <label>Описание:<textarea id='edit-description'>${product.description || ''}</textarea></label><br>
            <label>Фильтры:<input type='text' id='edit-filters' value='${product.filters || ''}'></label><br>
        `;
    }
    modal.innerHTML = `
        <div style='background:#fff;padding:36px 36px 28px 36px;border-radius:16px;min-width:380px;max-width:98vw;box-shadow:0 8px 40px #0003;position:relative;font-family:Poppins,sans-serif;'>
            <h3 style='margin-top:0;margin-bottom:22px;font-size:1.35rem;color:#8E3796;text-align:center;letter-spacing:1px;'>Редактировать ${product.type === 'book' ? 'книгу' : 'мерч'}</h3>
            <form id='editProductForm' style='display:flex;flex-direction:column;gap:18px;'>
                <label style='display:flex;flex-direction:column;gap:6px;font-weight:500;color:#4F3076;'>Название:
                    <input type='text' id='edit-title' value='${product.title || ''}' required style='padding:8px 12px;border-radius:7px;border:1.5px solid #8E3796;font-size:1em;'>
                </label>
                <label style='display:flex;flex-direction:column;gap:6px;font-weight:500;color:#4F3076;'>Цена:
                    <input type='number' id='edit-price' value='${product.price || ''}' required style='padding:8px 12px;border-radius:7px;border:1.5px solid #8E3796;font-size:1em;'>
                </label>
                <label style='display:flex;flex-direction:column;gap:6px;font-weight:500;color:#4F3076;'>Картинка (url):
                    <input type='text' id='edit-image' value='${product.image || ''}' style='padding:8px 12px;border-radius:7px;border:1.5px solid #8E3796;font-size:1em;'>
                </label>
                ${product.type === 'book' ? `
                <label style='display:flex;flex-direction:column;gap:6px;font-weight:500;color:#4F3076;'>Автор:
                    <input type='text' id='edit-author' value='${product.author || ''}' style='padding:8px 12px;border-radius:7px;border:1.5px solid #8E3796;font-size:1em;'>
                </label>
                <label style='display:flex;flex-direction:column;gap:6px;font-weight:500;color:#4F3076;'>Жанры:
                    <input type='text' id='edit-genres' value='${product.genres || ''}' style='padding:8px 12px;border-radius:7px;border:1.5px solid #8E3796;font-size:1em;'>
                </label>
                <label style='display:flex;flex-direction:column;gap:6px;font-weight:500;color:#4F3076;'>Описание:
                    <textarea id='edit-description' style='padding:10px 12px;border-radius:7px;border:1.5px solid #8E3796;font-size:1em;min-height:70px;resize:vertical;'>${product.description || ''}</textarea>
                </label>
                ` : `
                <label style='display:flex;flex-direction:column;gap:6px;font-weight:500;color:#4F3076;'>Описание:
                    <textarea id='edit-description' style='padding:10px 12px;border-radius:7px;border:1.5px solid #8E3796;font-size:1em;min-height:70px;resize:vertical;'>${product.description || ''}</textarea>
                </label>
                <label style='display:flex;flex-direction:column;gap:6px;font-weight:500;color:#4F3076;'>Фильтры:
                    <input type='text' id='edit-filters' value='${product.filters || ''}' style='padding:8px 12px;border-radius:7px;border:1.5px solid #8E3796;font-size:1em;'>
                </label>
                `}
                <div style='margin-top:10px;display:flex;gap:16px;justify-content:center;'>
                    <button type='submit' class='admin-product-edit-btn' style='min-width:120px;font-size:1.08em;padding:10px 0;'>Сохранить</button>
                    <button type='button' id='editProductCancel' class='admin-product-delete-btn' style='min-width:120px;font-size:1.08em;padding:10px 0;'>Отмена</button>
                </div>
            </form>
        </div>
    `;
    // Закрытие по кнопке
    document.getElementById('editProductCancel').onclick = () => { modal.remove(); };
    // Сохранение
    document.getElementById('editProductForm').onsubmit = async function(e) {
        e.preventDefault();
        const data = {
            title: document.getElementById('edit-title').value,
            price: parseFloat(document.getElementById('edit-price').value),
            image: document.getElementById('edit-image').value
        };
        if (product.type === 'book') {
            data.author = document.getElementById('edit-author').value;
            data.genres = document.getElementById('edit-genres').value;
            data.description = document.getElementById('edit-description').value;
        } else {
            data.description = document.getElementById('edit-description').value;
            data.filters = document.getElementById('edit-filters').value;
        }
        const res = await fetch(`/api/admin/products/${product.type}/${product.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (res.ok) {
            modal.remove();
            loadProducts(product.type);
        } else {
            alert('Ошибка сохранения');
        }
    };
}

// Загрузка и отображение отзывов
async function loadReviews() {
    const reviewsSection = document.getElementById('reviews-section');
    reviewsSection.innerHTML = '<div class="admin-loading">Загрузка...</div>';
    try {
        const res = await fetch('/api/admin/reviews');
        if (!res.ok) throw new Error('Ошибка загрузки отзывов');
        const reviews = await res.json();
        if (!reviews.length) {
            reviewsSection.innerHTML = '<p>Нет отзывов.</p>';
            return;
        }
        let html = `<table class="admin-table"><thead><tr><th>ID</th><th>Пользователь</th><th>Текст</th><th>Рейтинг</th><th>Тип</th><th>ID товара</th><th>Дата</th><th>Действия</th></tr></thead><tbody>`;
        for (const r of reviews) {
            html += `<tr><td>${r.id}</td><td>${r.username || 'user#'+r.user_id}</td><td style='max-width:220px;white-space:pre-line;'>${r.review_text}</td><td>${r.rating}</td><td>${r.type === 'book' ? 'Книга' : 'Мерч'}</td><td>${r.book_id}</td><td>${new Date(r.created_at).toLocaleString()}</td><td><button class='admin-review-delete-btn' data-id='${r.id}'>Удалить</button></td></tr>`;
        }
        html += '</tbody></table>';
        reviewsSection.innerHTML = html;
        document.querySelectorAll('.admin-review-delete-btn').forEach(btn => {
            btn.addEventListener('click', async function() {
                const id = this.dataset.id;
                if (confirm('Удалить отзыв #' + id + '?')) {
                    const res = await fetch(`/api/admin/reviews/${id}`, { method: 'DELETE' });
                    if (res.ok) {
                        loadReviews();
                    } else {
                        alert('Ошибка удаления отзыва');
                    }
                }
            });
        });
    } catch (e) {
        reviewsSection.innerHTML = '<div class="admin-error">Ошибка загрузки отзывов</div>';
    }
}

// Загрузка и отображение формы добавления товара
function renderAddProductForm() {
    const section = document.getElementById('add-product-section');
    section.innerHTML = `
        <form id="addProductForm" enctype="multipart/form-data" style="max-width:480px;margin:0 auto;background:#fff;padding:32px 28px;border-radius:18px;box-shadow:0 4px 32px #0002;display:flex;flex-direction:column;gap:0;">
            <h3 style="color:#8E3796;text-align:center;margin-bottom:28px;">Добавить товар</h3>
            <div style="display:grid;grid-template-columns:130px 1fr;gap:16px 18px;align-items:center;">
                <label for="add-type" style="font-weight:500;color:#4F3076;text-align:right;">Тип:</label>
                <select id="add-type" name="type" style="padding:8px 12px;border-radius:7px;border:1.5px solid #8E3796;font-size:1em;width:100%;">
                    <option value="book">Книга</option>
                    <option value="merch">Мерч</option>
                </select>
                <label for="add-title" style="font-weight:500;color:#4F3076;text-align:right;">Название:</label>
                <input type="text" id="add-title" name="title" required style="padding:8px 12px;border-radius:7px;border:1.5px solid #8E3796;font-size:1em;width:100%;">
                <label for="add-price" style="font-weight:500;color:#4F3076;text-align:right;">Цена:</label>
                <input type="number" id="add-price" name="price" required style="padding:8px 12px;border-radius:7px;border:1.5px solid #8E3796;font-size:1em;width:100%;">
                <label for="add-image" style="font-weight:500;color:#4F3076;text-align:right;">Картинка:</label>
                <input type="file" id="add-image" name="image" accept="image/*" required style="padding:8px 0;border-radius:7px;border:1.5px solid #8E3796;font-size:1em;width:100%;background:#fff;">
            </div>
            <div id="add-book-fields" style="display:grid;grid-template-columns:130px 1fr;gap:16px 18px;align-items:center;margin-top:10px;">
                <label for="add-author" style="font-weight:500;color:#4F3076;text-align:right;">Автор:</label>
                <input type="text" id="add-author" name="author" style="padding:8px 12px;border-radius:7px;border:1.5px solid #8E3796;font-size:1em;width:100%;">
                <label for="add-genres" style="font-weight:500;color:#4F3076;text-align:right;">Жанры:</label>
                <input type="text" id="add-genres" name="genres" style="padding:8px 12px;border-radius:7px;border:1.5px solid #8E3796;font-size:1em;width:100%;">
                <label for="add-description" style="font-weight:500;color:#4F3076;text-align:right;align-self:start;">Описание:</label>
                <textarea id="add-description" name="description" style="padding:10px 12px;border-radius:7px;border:1.5px solid #8E3796;font-size:1em;min-height:70px;resize:vertical;width:100%;"></textarea>
            </div>
            <div id="add-merch-fields" style="display:none;grid-template-columns:130px 1fr;gap:16px 18px;align-items:center;margin-top:10px;">
                <label for="add-description-merch" style="font-weight:500;color:#4F3076;text-align:right;align-self:start;">Описание:</label>
                <textarea id="add-description-merch" name="description" style="padding:10px 12px;border-radius:7px;border:1.5px solid #8E3796;font-size:1em;min-height:70px;resize:vertical;width:100%;"></textarea>
                <label for="add-filters" style="font-weight:500;color:#4F3076;text-align:right;">Фильтры:</label>
                <input type="text" id="add-filters" name="filters" style="padding:8px 12px;border-radius:7px;border:1.5px solid #8E3796;font-size:1em;width:100%;">
            </div>
            <div style="margin-top:22px;display:flex;gap:16px;justify-content:center;">
                <button type="submit" class="admin-product-edit-btn" style="min-width:120px;font-size:1.08em;padding:10px 0;">Добавить</button>
                <button type="reset" class="admin-product-delete-btn" style="min-width:120px;font-size:1.08em;padding:10px 0;">Очистить</button>
            </div>
            <div id="add-product-message" style="text-align:center;margin-top:8px;font-weight:500;"></div>
        </form>
    `;
    // Переключение полей по типу
    document.getElementById('add-type').onchange = function() {
        if (this.value === 'book') {
            document.getElementById('add-book-fields').style.display = '';
            document.getElementById('add-merch-fields').style.display = 'none';
        } else {
            document.getElementById('add-book-fields').style.display = 'none';
            document.getElementById('add-merch-fields').style.display = '';
        }
    };
    // Отправка формы
    document.getElementById('addProductForm').onsubmit = async function(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        // Для мерча корректно подставить описание
        if (formData.get('type') === 'merch') {
            formData.set('description', document.getElementById('add-description-merch').value);
        }
        const res = await fetch('/api/admin/products', {
            method: 'POST',
            body: formData
        });
        const msg = document.getElementById('add-product-message');
        if (res.ok) {
            msg.style.color = '#4F3076';
            msg.textContent = 'Товар успешно добавлен!';
            form.reset();
            loadProducts('all');
        } else {
            msg.style.color = '#e63946';
            msg.textContent = 'Ошибка добавления товара';
        }
    };
}

// === Загрузка и отображение заказов (админка) ===
async function loadAdminOrders() {
    const ordersSection = document.getElementById('orders-section');
    ordersSection.innerHTML = '<div class="admin-loading">Загрузка...</div>';
    try {
        const res = await fetch('/api/admin/orders');
        if (!res.ok) throw new Error('Ошибка загрузки заказов');
        const orders = await res.json();
        if (!orders.length) {
            ordersSection.innerHTML = '<p>Нет заказов.</p>';
            return;
        }
        let html = `<table class="admin-table"><thead><tr><th>ID</th><th>Пользователь</th><th>Email</th><th>Дата</th><th>Адрес</th><th>Сумма</th><th>Статус</th><th>Товары</th></tr></thead><tbody>`;
        for (const o of orders) {
            const address = `${o.city || ''}, ${o.street || ''}, д.${o.house || ''}${o.apartment ? ', кв.' + o.apartment : ''}, ${o.postal_code || ''}`;
            html += `<tr><td>${o.id}</td><td>${o.name || o.username || 'user#'+o.user_id}</td><td>${o.email || ''}</td><td>${new Date(o.created_at).toLocaleString()}</td><td>${address}</td><td>₽${o.total}</td>`;
            html += `<td><div style='display:flex;flex-direction:column;gap:4px;'>
                <select class='admin-order-status-select' data-id='${o.id}'>
                    <option value="Принят"${o.status==="Принят"?" selected":""}>Принят</option>
                    <option value="Отправлен"${o.status==="Отправлен"?" selected":""}>Отправлен</option>
                    <option value="Доставлен"${o.status==="Доставлен"?" selected":""}>Доставлен</option>
                </select>
                <div class='admin-order-track-inputs' style='${o.status==="Отправлен"?"":"display:none;"}margin-top:6px;'>
                    <input type='text' class='admin-track-number-input' placeholder='Трек-номер' value='${o.tracking_number||""}' style='margin-bottom:4px;padding:4px 8px;border-radius:5px;border:1px solid #8E3796;width:100%;'>
                    <input type='text' class='admin-pickup-code-input' placeholder='Код для получения' value='${o.pickup_code||""}' style='padding:4px 8px;border-radius:5px;border:1px solid #8E3796;width:100%;'>
                    <button class='admin-save-track-btn' data-id='${o.id}' style='margin-top:4px;padding:4px 10px;border-radius:5px;background:#8E3796;color:#fff;border:none;'>Сохранить</button>
                </div>
                ${(o.tracking_number || o.pickup_code) ? `<div class='admin-order-track-block' style='margin-top:4px;font-size:0.98em;background:#f7f3ff;padding:6px 10px;border-radius:7px;color:#4F3076;'>${o.tracking_number ? `<div><b>Трек-номер:</b> <span style='font-family:monospace;'>${o.tracking_number}</span></div>` : ''}${o.pickup_code ? `<div><b>Код для получения:</b> <span style='font-family:monospace;'>${o.pickup_code}</span></div>` : ''}</div>` : ''}
            </div></td>`;
            html += `<td><div class='admin-order-items-list'>`;
            html += o.items.map(item => `
                <div class='admin-order-item-row'>
                    <img src='${item.image}' alt='' >
                    <span>${item.title}</span>
                    <span style='font-size:0.95em;color:#888;'>(${item.product_type === 'book' ? 'Книга' : 'Мерч'})</span>
                    <span>₽${item.price} × ${item.quantity}</span>
                </div>
            `).join('');
            html += `</div></td></tr>`;
        }
        html += '</tbody></table>';
        ordersSection.innerHTML = html;
        // Обработчик смены статуса
        document.querySelectorAll('.admin-order-status-select').forEach(sel => {
            sel.addEventListener('change', function() {
                const orderId = this.dataset.id;
                const newStatus = this.value;
                const row = this.closest('td');
                const trackInputs = row.querySelector('.admin-order-track-inputs');
                if (newStatus === 'Отправлен') {
                    trackInputs.style.display = '';
                } else {
                    trackInputs.style.display = 'none';
                    // Можно сразу отправить PATCH без треков
                    fetch(`/api/admin/orders/${orderId}/status`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ status: newStatus })
                    }).then(res => {
                        if (res.ok) loadAdminOrders();
                        else alert('Ошибка обновления статуса заказа');
                    });
                }
            });
        });
        // Обработчик сохранения трек-номера и кода
        document.querySelectorAll('.admin-save-track-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const orderId = this.dataset.id;
                const row = this.closest('td');
                const statusSel = row.querySelector('.admin-order-status-select');
                const newStatus = statusSel.value;
                const trackNumber = row.querySelector('.admin-track-number-input').value;
                const pickupCode = row.querySelector('.admin-pickup-code-input').value;
                fetch(`/api/admin/orders/${orderId}/status`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: newStatus, tracking_number: trackNumber, pickup_code: pickupCode })
                }).then(res => {
                    if (res.ok) loadAdminOrders();
                    else alert('Ошибка обновления трек-номера/кода');
                });
            });
        });
    } catch (e) {
        ordersSection.innerHTML = '<div class="admin-error">Ошибка загрузки заказов</div>';
    }
}

document.getElementById('toShopBtn').onclick = function() {
    window.location.href = '../home.html';
}; 