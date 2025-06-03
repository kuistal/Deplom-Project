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
        <div class="order-block">
            <div><b>Заказ #${order.id}</b> от ${new Date(order.created_at).toLocaleString()} — <b>₽${order.total}</b></div>
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item">
                        <img src="${item.image}" alt="${item.title}" style="width:40px;height:60px;object-fit:cover;">
                        <span>${item.title}</span>
                        <span>${item.product_type === 'book' ? 'Книга' : 'Мерч'}</span>
                        <span>₽${item.price} × ${item.quantity}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}