async function fetchBooks() {
    try {
        const response = await fetch('http://localhost:3001/api/books');
        if (!response.ok) throw new Error('Не удалось загрузить книги');
        const books = await response.json();
        return books;
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

async function toggleFavorite(bookId, btn) {
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
        body: JSON.stringify({ bookId })
    });
    const data = await res.json();
    userFavorites = data.favorites;
    btn.classList.toggle('fav-active', userFavorites.includes(bookId));
}

async function displayBooks(books) {
    userFavorites = await getUserFavorites();
    const container = document.getElementById('book-cards');
    container.innerHTML = '';
    books.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.className = 'card1';
        
        // Вычисляем старую цену (на 30% больше текущей) и процент скидки
        const oldPrice = (book.price * 1.3).toFixed(0);
        const discount = 30;

        let imgSrc = '';
        if (book.image && book.image !== 'undefined' && book.image !== '') {
            imgSrc = book.image.startsWith('.') ? book.image.substring(1) : book.image;
            if (imgSrc.startsWith('/')) imgSrc = imgSrc.substring(1);
        } else {
            imgSrc = 'bookpage/placeholder.jpg';
        }

        bookCard.innerHTML = `
            <img src="../${imgSrc}" alt="${book.title}" onerror="this.src='../bookpage/placeholder.jpg';">
            <div class="price-section">
                <span class="old-price">₽ ${oldPrice}</span>
                <span class="new-price">₽ ${book.price}</span>
                <span class="discount">-${discount}%</span>
            </div>
            <p>
                ${book.title}<br>
                <span class="author">${book.author}</span>
            </p>
            <div class="description-short" style="font-size:0.95em;color:#555;margin:8px 0 0 0;min-height:40px;">${book.description ? book.description.substring(0, 100) + (book.description.length > 100 ? '...' : '') : ''}</div>
            <div class="sec">
                <a href="../cartpage/cart.html">Купить</a>
            </div>
        `;
        container.appendChild(bookCard);

        bookCard.addEventListener('click', function() {
            goToProductPage(book.id, imgSrc, book.title, book.author, book.price, oldPrice, discount, book.description || 'Описание отсутствует');
            window.location.href = '../product/product.html';
        });

        // Добавляю обработчик для кнопки 'Купить'
        bookCard.querySelector('.sec a').addEventListener('click', function(e) {
            e.stopPropagation();
            // Добавить товар в корзину
            const product = {
                id: `${book.title}-${book.author}`,
                image: imgSrc,
                title: book.title,
                author: book.author,
                price: parseFloat(book.price),
                quantity: 1
            };
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            const existingProductIndex = cart.findIndex(item => item.id === product.id);
            if (existingProductIndex !== -1) {
                cart[existingProductIndex].quantity += 1;
            } else {
                cart.push(product);
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            window.location.href = '../cartpage/cart.html';
        });
    });
}

function goToProductPage(id, image, title, author, price, oldPrice, discount, description) {
    localStorage.setItem('productId', id);
    localStorage.setItem('productImage', image);
    localStorage.setItem('productTitle', title);
    localStorage.setItem('productAuthor', author);
    localStorage.setItem('productPrice', price);
    localStorage.setItem('productOldPrice', oldPrice);
    localStorage.setItem('productDiscount', discount);
    localStorage.setItem('productDescription', description);
}

async function populateGenres() {
    const books = await fetchBooks();
    const genreSelect = document.getElementById('genre');
    const genres = new Set();
    books.forEach(book => {
        if (book.genres) {
            book.genres.split(',').forEach(genre => genres.add(genre.trim()));
        }
    });
    genres.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre;
        option.textContent = genre;
        genreSelect.appendChild(option);
    });
}

async function filterBooks() {
    const genre = document.getElementById('genre').value;
    const books = await fetchBooks();
    const filteredBooks = genre
        ? books.filter(book => (book.genres || '').split(',').map(g => g.trim()).includes(genre))
        : books;
    displayBooks(filteredBooks);
}

// Dark mode toggle functionality
const darkModeToggle = document.getElementById('darkModeToggle');
const darkModeIcon = document.getElementById('darkModeIcon');
darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
        darkModeIcon.classList.remove('bi-brightness-high');
        darkModeIcon.classList.add('bi-moon');
    } else {
        darkModeIcon.classList.remove('bi-moon');
        darkModeIcon.classList.add('bi-brightness-high');
    }
});

// Function to handle review page navigation
function goToReviewPage(bookImage, bookTitle, bookAuthor) {
    localStorage.setItem("bookImage", bookImage);
    localStorage.setItem("bookTitle", bookTitle);
    localStorage.setItem("bookAuthor", bookAuthor);
    localStorage.setItem("bookReviews", JSON.stringify([])); // Reset reviews for new book
    window.location.href = "review.html"; // Redirect to review page
}

// Initialize: load books and populate genres
populateGenres();
filterBooks();

// Добавляю стили для fav-btn
const style = document.createElement('style');
style.innerHTML = `.fav-btn { position:absolute; top:10px; right:10px; background:none; border:none; font-size:1.7rem; color:#8E3796; cursor:pointer; transition:color 0.2s; z-index:2; }
.fav-btn.fav-active { color:#DAE034; text-shadow:0 0 6px #8E3796; }`;
document.head.appendChild(style);