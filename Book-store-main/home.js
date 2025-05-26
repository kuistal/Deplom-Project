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

function initHeaderFeatures() {
    // Проверка, включён ли тёмный режим ранее
    if (localStorage.getItem("darkMode") === "enabled") {
        body.classList.add("dark");
        nav && nav.classList.add("dark");
        footer && footer.classList.add("dark");
        darkModeIcon && darkModeIcon.classList.remove("bi-brightness-high");
        darkModeIcon && darkModeIcon.classList.add("bi-moon");
        navLinks.forEach(link => link.classList.add("dark"));
        rightNavLink && rightNavLink.classList.add("dark");
        socialLinks.forEach(link => link.classList.add("dark"));
        textFootLinks.forEach(link => link.classList.add("dark"));
        copyrightText && copyrightText.classList.add("dark");
    }

    // Переключение тёмного режима
    darkModeToggle && darkModeToggle.addEventListener("click", () => {
        body.classList.toggle("dark");
        nav && nav.classList.toggle("dark");
        footer && footer.classList.toggle("dark");

        if (body.classList.contains("dark")) {
            darkModeIcon && darkModeIcon.classList.remove("bi-brightness-high");
            darkModeIcon && darkModeIcon.classList.add("bi-moon");
            localStorage.setItem("darkMode", "enabled");
        } else {
            darkModeIcon && darkModeIcon.classList.remove("bi-moon");
            darkModeIcon && darkModeIcon.classList.add("bi-brightness-high");
            localStorage.setItem("darkMode", "disabled");
        }

        navLinks.forEach(link => link.classList.toggle("dark"));
        rightNavLink && rightNavLink.classList.toggle("dark");
        socialLinks.forEach(link => link.classList.toggle("dark"));
        textFootLinks.forEach(link => link.classList.toggle("dark"));
        copyrightText && copyrightText.classList.toggle("dark");
    });
}

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

// Управление loader: скрываем после DOMContentLoaded или через 2 секунды (что наступит раньше)
function hideLoader() {
    const loader = document.getElementById("loader");
    if (loader) loader.style.display = "none";
}

// Переменные для карусели
let currentIndex = 0;
const booksPerPage = 3;

// Функция для загрузки книг
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

// Функция отображения новинок
async function displayNewArrivals() {
    try {
        const books = await fetchBooks();
        const container = document.getElementById('new-collection');
        container.innerHTML = '';

        const newArrivals = books.slice(currentIndex, currentIndex + booksPerPage);

        if (newArrivals.length === 0) {
            container.innerHTML = '<p class="no-books">Книги не найдены</p>';
            return;
        }

        newArrivals.forEach(book => {
            const bookCard = document.createElement('div');
            bookCard.className = 'collection-book';
            
            const imgSrc = book.image ? (book.image.startsWith('/') ? book.image : '/' + book.image) : '/bookpage/placeholder.jpg';
            bookCard.innerHTML = `
                <div class="collection-img">
                    <img src="${imgSrc}" alt="${book.title}" loading="lazy" onerror="this.src='bookpage/placeholder.jpg';">
                </div>
                <div class="collection-content">
                    <div class="collection-content-detail">
                        <div>
                            <h5>${book.title}</h5>
                            <p>${book.publisher || ''}</p>
                            <span class="book-genre">$${
                                book.genres
                                    ? (Array.isArray(book.genres)
                                        ? book.genres.join(', ')
                                        : book.genres.split(',').map(g => g.trim()).join(', '))
                                    : ''
                            }</span>
                        </div>
                        <div>
                            <h6>₽ ${book.price}</h6>
                        </div>
                    </div>
                    <div>
                        <a href="product/product.html" class="view-book-link" onclick="goToProductPage('${imgSrc}', '${book.title}', '${book.author}', ${book.price}, '', '', '${book.description || 'Описание отсутствует'}'); return false;">Купить</a>
                    </div>
                </div>
            `;
            container.appendChild(bookCard);
        });

        updateCarouselButtons(books.length);
    } catch (error) {
        console.error('Error displaying books:', error);
        const container = document.getElementById('new-collection');
        container.innerHTML = '<p class="error">Ошибка загрузки книг</p>';
    }
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

// Инициализация: загрузка новинок при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    hideLoader();
    displayNewArrivals();
});
setTimeout(hideLoader, 2000);