async function fetchBooks() {
    try {
        const response = await fetch('http://localhost:3001/api/books');
        if (!response.ok) throw new Error('Не удалось загрузить книги');
        const books = await response.json();
        console.log('Fetched books:', books); // Отладочный вывод
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
    const container = document.getElementById('book-cards');
    container.innerHTML = '';
    
    if (!books || books.length === 0) {
        container.innerHTML = '<p class="no-books">Книги не найдены</p>';
        return;
    }

    // Get user favorites at the start
    userFavorites = await getUserFavorites();

    books.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.className = 'card1';
        
        const oldPrice = (book.price * 1.3).toFixed(0);
        const discount = 30;

        // Fix image path handling
        let imgSrc = book.image ? book.image.replace(/^.*bookimages[\\/]/, '/bookimages/') : '/bookpage/placeholder.jpg';
        
        // Create favorite button
        const favBtn = document.createElement('button');
        favBtn.className = `fav-btn${userFavorites.includes(book.id) ? ' fav-active' : ''}`;
        favBtn.innerHTML = '<i class="bi bi-heart-fill"></i>';
        favBtn.onclick = (e) => {
            e.stopPropagation();
            toggleFavorite(book.id, favBtn);
        };

        bookCard.innerHTML = `
            <img src="${imgSrc}" alt="${book.title}" onerror="this.src='/bookpage/placeholder.jpg';" class="card-image">
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
                <a href="#" class="buy-book">Купить</a>
            </div>
        `;

        // Add favorite button to the card
        bookCard.insertBefore(favBtn, bookCard.firstChild);
        container.appendChild(bookCard);

        bookCard.addEventListener('click', function() {
            console.log('goToProductPage image:', imgSrc);
            localStorage.setItem('productType', 'book');
            goToProductPage(book.id, imgSrc, book.title, book.author, book.price, oldPrice, discount, book.description || 'Описание отсутствует');
            window.location.href = '../product/product.html';
        });

        // Добавляю обработчик для кнопки 'Купить'
        bookCard.querySelector('.buy-book').addEventListener('click', function(e) {
            e.preventDefault();
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
    const genreSelect = document.getElementById('genre');
    const genres = [
        { value: '', label: 'Все жанры' },
        { value: 'comics', label: 'Comics' },
        { value: 'manga', label: 'Manga' },
        { value: 'супергерой', label: 'Супергерой' },
        { value: 'экшен', label: 'Экшен' },
        { value: 'триллер', label: 'Триллер' },
        { value: 'детектив', label: 'Детектив' },
        { value: 'ужасы', label: 'Ужасы' },
        { value: 'боевик', label: 'Боевик' },
        { value: 'сёнэн', label: 'Сёнэн' },
        { value: 'приключение', label: 'Приключение' },
        { value: 'фантастика', label: 'Фантастика' }
    ];

    // Очищаем текущие опции
    genreSelect.innerHTML = '';

    // Добавляем новые опции
    genres.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre.value;
        option.textContent = genre.label;
        genreSelect.appendChild(option);
    });
}

async function filterBooks() {
    const genre = document.getElementById('genre').value.toLowerCase();
    console.log('Selected genre:', genre);
    
    const books = await fetchBooks();
    console.log('Books before filtering:', books);
    
    const filteredBooks = genre === ''
        ? books
        : books.filter(book => {
            let genresArr = Array.isArray(book.genres) ? book.genres : (book.genres ? book.genres.split(',') : []);
            const bookGenres = genresArr.map(g => g.trim().toLowerCase());
            return bookGenres.includes(genre);
        });
    
    console.log('Filtered books:', filteredBooks);
    displayBooks(filteredBooks);
}

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