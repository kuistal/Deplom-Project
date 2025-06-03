document.addEventListener('DOMContentLoaded', async function() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '../../loginform/loginform/index.html';
        return;
    }
    const favRes = await fetch('http://localhost:3001/api/favorites', {
        headers: { 'Authorization': 'Bearer ' + token }
    });
    const favoriteIds = await favRes.json();
    if (!favoriteIds.length) {
        document.getElementById('wishlist-books').innerHTML = '<p>У вас нет избранных книг.</p>';
        return;
    }
    const booksRes = await fetch('http://localhost:3001/api/books');
    const books = await booksRes.json();
    const favBooks = books.filter(b => favoriteIds.includes(b.id.toString()));
    document.getElementById('wishlist-books').innerHTML =
        '<ul style="margin:8px 0 0 0;padding:0;list-style:none;">' +
        favBooks.map(b => `<li style='margin-bottom:12px;display:flex;align-items:center;'><img src="../../${b.image.startsWith('/') ? b.image.substring(1) : b.image}" alt="" style="width:40px;height:60px;vertical-align:middle;margin-right:12px;border-radius:4px;box-shadow:0 2px 6px #8E379633;">${b.title}</li>`).join('') +
        '</ul>';
});

window.addEventListener('DOMContentLoaded', function() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.role === 'admin') {
        const adminBtn = document.getElementById('adminPanelBtn');
        adminBtn.style.display = '';
        adminBtn.addEventListener('click', function() {
            window.location.href = '../../admin/admin.html';
        });
    }
    if (document.getElementById('profileBtn')) {
        document.getElementById('profileBtn').addEventListener('click', function() {
            window.location.href = '../profile.html';
        });
    }
    if (document.getElementById('ordersBtn')) {
        document.getElementById('ordersBtn').addEventListener('click', function() {
            window.location.href = '../profile.html';
        });
    }
    if (document.getElementById('wishlistBtn')) {
        document.getElementById('wishlistBtn').addEventListener('click', function() {
            window.location.href = 'wishlist.html';
        });
    }
    if (document.getElementById('shopBtn')) {
        document.getElementById('shopBtn').addEventListener('click', function() {
            window.location.href = '../../home.html';
        });
    }
    if (document.getElementById('logoutBtn')) {
        document.getElementById('logoutBtn').addEventListener('click', function() {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '../../loginform/loginform/index.html';
        });
    }
}); 