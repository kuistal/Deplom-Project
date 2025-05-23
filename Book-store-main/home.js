const darkModeToggle = document.getElementById("darkModeToggle");
const darkModeIcon = document.getElementById("darkModeIcon");
const body = document.body;
const nav = document.querySelector("nav");
const navLinks = document.querySelectorAll(".left-nav ul li a");
const rightNavLink = document.querySelector(".right-nav a");
const footer = document.querySelector("footer");
const socialLinks = document.querySelectorAll(".social a");
const textFootLinks = document.querySelectorAll(".text_foot ul li");
const copyrightText = document.querySelector(".copyright");
const scrollToTopBtn = document.getElementById("scrollToTopBtn");

// Проверка, включён ли тёмный режим ранее
if (localStorage.getItem("darkMode") === "enabled") {
    body.classList.add("dark");
    nav.classList.add("dark");
    footer.classList.add("dark");
    darkModeIcon.classList.remove("bi-brightness-high");
    darkModeIcon.classList.add("bi-moon");
    navLinks.forEach(link => link.classList.add("dark"));
    rightNavLink.classList.add("dark");
    socialLinks.forEach(link => link.classList.add("dark"));
    textFootLinks.forEach(link => link.classList.add("dark"));
    copyrightText.classList.add("dark");
}

// Переключение тёмного режима
darkModeToggle.addEventListener("click", () => {
    body.classList.toggle("dark");
    nav.classList.toggle("dark");
    footer.classList.toggle("dark");

    if (body.classList.contains("dark")) {
        darkModeIcon.classList.remove("bi-brightness-high");
        darkModeIcon.classList.add("bi-moon");
        localStorage.setItem("darkMode", "enabled");
    } else {
        darkModeIcon.classList.remove("bi-moon");
        darkModeIcon.classList.add("bi-brightness-high");
        localStorage.setItem("darkMode", "disabled");
    }

    navLinks.forEach(link => link.classList.toggle("dark"));
    rightNavLink.classList.toggle("dark");
    socialLinks.forEach(link => link.classList.toggle("dark"));
    textFootLinks.forEach(link => link.classList.toggle("dark"));
    copyrightText.classList.toggle("dark");
});

// Инициализация AOS
AOS.init({ duration: 1000, once: false });

// Управление кнопкой "Scroll to Top"
window.onscroll = function () {
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        scrollToTopBtn.style.display = "block";
    } else {
        scrollToTopBtn.style.display = "none";
    }
};

scrollToTopBtn.onclick = function () {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
};

// Управление загрузкой (loader)
setTimeout(() => {
    document.getElementById("loader").style.display = "none";
}, 2000);

// Глобальная переменная для хранения текущего фильтра
let currentGenre = 'all';

// Функция для фильтрации книг по жанру
function filterBooksByGenre(books, genre) {
    if (genre === 'all') return books;
    return books.filter(book => book.genre && book.genre.toLowerCase() === genre);
}

// Обработчик изменения выбранного жанра
document.getElementById('genre-select').addEventListener('change', async (event) => {
    currentGenre = event.target.value;
    currentIndex = 0;
    await displayNewArrivals();
});

// Обновляем функцию displayNewArrivals для поддержки фильтрации
async function displayNewArrivals() {
    const books = await fetchBooks();
    const filteredBooks = filterBooksByGenre(books, currentGenre);
    const container = document.getElementById('new-collection');
    container.innerHTML = '';

    const newArrivals = filteredBooks.slice(currentIndex, currentIndex + booksPerPage);

    if (newArrivals.length === 0) {
        container.innerHTML = '<p class="no-books">Книги не найдены</p>';
        return;
    }

    newArrivals.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.className = 'collection-book';
        let imgSrc = '';
        if (book.image && book.image !== 'undefined' && book.image !== '') {
            imgSrc = book.image.startsWith('.') ? book.image.substring(1) : book.image;
            if (imgSrc.startsWith('/')) imgSrc = imgSrc.substring(1);
        } else {
            imgSrc = 'bookpage/placeholder.jpg';
        }
        bookCard.innerHTML = `
            <div class="collection-img">
                <img src="${imgSrc}" alt="${book.title}" loading="lazy" onerror="this.src='bookpage/placeholder.jpg';">
            </div>
            <div class="collection-content">
                <div class="collection-content-detail">
                    <div>
                        <h5>${book.title}</h5>
                        <p>${book.publisher || ''}</p>
                        <span class="book-genre">${book.genre || ''}</span>
                    </div>
                    <div>
                        <h6>₽ ${book.price}</h6>
                    </div>
                </div>
                <div>
                    <a href="#" class="view-book-link" onclick="goToProductPage('${imgSrc}', '${book.title}', '${book.author}', ${book.price}, '', '', '${book.description || 'Описание отсутствует'}'); return false;">Купить</a>
                </div>
            </div>
        `;
        container.appendChild(bookCard);
    });

    updateCarouselButtons(filteredBooks.length);
}

// Функция для обновления состояния кнопок карусели
function updateCarouselButtons(totalBooks) {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    prevBtn.classList.toggle('disabled', currentIndex === 0);
    nextBtn.classList.toggle('disabled', currentIndex + booksPerPage >= totalBooks);
}

// Обработчики для кнопок карусели
document.getElementById('prev-btn').addEventListener('click', async (e) => {
    e.preventDefault();
    const books = await fetchBooks();
    if (currentIndex > 0) {
        currentIndex -= booksPerPage;
        displayNewArrivals();
    }
});

document.getElementById('next-btn').addEventListener('click', async (e) => {
    e.preventDefault();
    const books = await fetchBooks();
    if (currentIndex + booksPerPage < books.length) {
        currentIndex += booksPerPage;
        displayNewArrivals();
    }
});

// Инициализация: загрузка новинок при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    displayNewArrivals();
});

function goToProductPage(image, title, author, price, oldPrice, discount, description) {
    localStorage.setItem('productImage', image);
    localStorage.setItem('productTitle', title);
    localStorage.setItem('productAuthor', author);
    localStorage.setItem('productPrice', price);
    localStorage.setItem('productOldPrice', oldPrice);
    localStorage.setItem('productDiscount', discount);
    localStorage.setItem('productDescription', description);
    window.location.href = 'product/product.html';
}

// Функция для загрузки books.json
async function fetchBooks() {
    try {
        const genre = currentGenre !== 'all' ? `?genre=${currentGenre}` : '';
        console.log('Fetching books with genre:', currentGenre);
        const response = await fetch(`http://localhost:3001/api/books${genre}`);
        if (!response.ok) throw new Error('Не удалось загрузить книги');
        const books = await response.json();
        console.log('Received books:', books);
        return books;
    } catch (error) {
        console.error('Ошибка:', error);
        return [];
    }
}

// Переменные для карусели
let currentIndex = 0;
const booksPerPage = 3;