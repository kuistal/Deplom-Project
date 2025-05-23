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
        favBooks.map(b => `<li style='margin-bottom:12px;display:flex;align-items:center;'><img src="../../${b.image}" alt="" style="width:40px;height:60px;vertical-align:middle;margin-right:12px;border-radius:4px;box-shadow:0 2px 6px #8E379633;">${b.title}</li>`).join('') +
        '</ul>';
}); 