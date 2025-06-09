if (document.getElementById('editProfile')) {
    document.getElementById('editProfile').addEventListener('click', function() {
        let newUsername = prompt('Enter new username:', document.getElementById('username').innerText);
        let newEmail = prompt('Enter new email:', document.getElementById('email').innerText);
        let newBio = prompt('Enter new bio:', document.getElementById('bio').innerText);
        
        if (newUsername) document.getElementById('username').innerText = newUsername;
        if (newEmail) document.getElementById('email').innerText = newEmail;
        if (newBio) document.getElementById('bio').innerText = newBio;
    });
}

if (document.getElementById('logoutBtn')) {
    document.getElementById('logoutBtn').addEventListener('click', function() {
        alert('You have been logged out!');
        window.location.href = '../loginform/loginform/index.html';
    });
}

if (document.getElementById('avatarInput')) {
    document.getElementById('avatarInput').addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('avatar').src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
}

window.addEventListener('DOMContentLoaded', function() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.role === 'admin') {
        const adminBtn = document.getElementById('adminPanelBtn');
        adminBtn.style.display = '';
        adminBtn.addEventListener('click', function() {
            window.location.href = '../admin/admin.html';
        });
    }
    if (document.getElementById('profileBtn')) {
        document.getElementById('profileBtn').addEventListener('click', function() {
            document.querySelector('.profile-card').style.display = 'block';
            document.getElementById('orders-section').style.display = 'none';
        });
    }
    if (document.getElementById('ordersBtn')) {
        document.getElementById('ordersBtn').addEventListener('click', function() {
            document.querySelector('.profile-card').style.display = 'none';
            document.getElementById('orders-section').style.display = 'block';
            loadOrders();
        });
    }
    if (document.getElementById('wishlistBtn')) {
        document.getElementById('wishlistBtn').addEventListener('click', function() {
            window.location.href = 'wishlist/wishlist.html';
        });
    }
    if (document.getElementById('shopBtn')) {
        document.getElementById('shopBtn').addEventListener('click', function() {
            window.location.href = '../home.html';
        });
    }
    if (document.getElementById('logoutBtn')) {
        document.getElementById('logoutBtn').addEventListener('click', function() {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '../loginform/loginform/index.html';
        });
    }
});

async function loadOrders() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;
    const res = await fetch(`/api/orders/${user.id}`);
    const orders = await res.json();
    const ordersList = document.getElementById('orders-list');
    if (!orders.length) {
        ordersList.innerHTML = '<p>У вас пока нет заказов.</p>';
        return;
    }
    ordersList.innerHTML = orders.map(order => `
        <div class="order-card">
          <div class="order-header">
            <span class="order-number">Заказ #${order.id}</span>
            <span class="order-date">${new Date(order.created_at).toLocaleString()}</span>
            <span class="order-status">Статус: <b>${order.status || '—'}</b></span>
            <span class="order-total">Сумма: <b>₽${order.total}</b></span>
          </div>
          ${(order.tracking_number || order.pickup_code) ? `<div class='order-track-block' style='margin: 0 0 16px 0; background: #f7f3ff; border-radius: 8px; padding: 10px 18px; color: #4F3076; font-size: 1.08em;'><b>Трек-номер:</b> <span style='font-family:monospace;'>${order.tracking_number || '-'}</span><br><b>Код для получения:</b> <span style='font-family:monospace;'>${order.pickup_code || '-'}</span></div>` : ''}
          <div class="order-items">
            ${order.items.map(item => `
              <div class="order-item">
                <img src="${item.image}" alt="${item.title}" class="order-item-img" />
                <div>
                  <div class="order-item-title">${item.title}</div>
                  <div class="order-item-qty">${item.product_type === 'book' ? 'Книга' : 'Мерч'} — ₽${item.price} × ${item.quantity}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
    `).join('');
}