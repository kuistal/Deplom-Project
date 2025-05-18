async function fetchBooks() {
    try {
        const response = await fetch('books.json');
        if (!response.ok) throw new Error('Не удалось загрузить книги');
        const books = await response.json();
        return books;
    } catch (error) {
        console.error('Ошибка:', error);
        return [];
    }
}

function displayBooks(books) {
    const container = document.getElementById('book-cards');
    container.innerHTML = '';
    books.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.className = 'card1';
        
        // Вычисляем старую цену (на 30% больше текущей) и процент скидки
        const oldPrice = (book.price * 1.3).toFixed(0);
        const discount = 30;

        bookCard.innerHTML = `
            <a href="../product/product.html" onclick="goToProductPage('${book.image_url}', '${book.title}', '${book.author}', ${book.price}, ${oldPrice}, ${discount}, '${book.description || 'Описание отсутствует'}')">
                <img src="${book.image_url}" alt="${book.title}">
            </a>
            <div class="price-section">
                <span class="old-price">₽ ${oldPrice}</span>
                <span class="new-price">₽ ${book.price}</span>
                <span class="discount">-${discount}%</span>
            </div>
            <p>${book.title}<br><i><b>${book.author}</b></i></p>
            <div class="sec">
                <a href="../cartpage/cart.html">Купить</a>
            </div>
        `;
        container.appendChild(bookCard);
    });
}

function goToProductPage(image, title, author, price, oldPrice, discount, description) {
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
        book.genres.forEach(genre => genres.add(genre));
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
    const filteredBooks = genre ? books.filter(book => book.genres.includes(genre)) : books;
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