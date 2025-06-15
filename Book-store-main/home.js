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
        const response = await fetch('http://217.198.13.177/api/books');
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
            let imgSrc = book.image ? (book.image.startsWith('/') ? book.image : '/' + book.image) : '/bookpage/placeholder.jpg';
            const card = document.createElement('div');
            card.className = 'similar-card';
            card.style = `width:320px; min-height:500px; border-radius:22px; box-shadow:0 8px 32px #0002; padding:28px 18px 28px 18px; background:#fff; text-align:center; cursor:pointer; border: none; transition:box-shadow 0.2s; display:flex; flex-direction:column; align-items:center; justify-content:flex-start;`;
            card.innerHTML = `
                <div style='width:100%;height:280px;display:flex;align-items:center;justify-content:center;background:#fff;border-radius:18px;padding:0;'>
                    <img src="${imgSrc}" alt="${book.title}" style="max-width:100%;max-height:100%;object-fit:contain;border-radius:18px;background:#fff;">
                </div>
                <div class="similar-title" style="font-weight:bold;margin:24px 0 14px;font-size:1.22em;min-height:54px;display:flex;align-items:center;justify-content:center;">${book.title}</div>
                <div class="similar-price" style="color:#4F3076;margin-bottom:28px;font-size:1.18em;">${book.price} ₽</div>
                <a href="#" class="btn" style="background:#8E3796;color:#fff;padding:14px 0;border-radius:10px;text-decoration:none;font-size:18px;width:100%;max-width:200px;align-self:center;">Подробнее</a>
            `;
            card.querySelector('.btn').onclick = (e) => {
                e.preventDefault();
                localStorage.setItem('productId', book.id);
                localStorage.setItem('productType', 'book');
                localStorage.setItem('productImage', imgSrc);
                localStorage.setItem('productTitle', book.title);
                localStorage.setItem('productAuthor', book.author || '');
                localStorage.setItem('productPrice', book.price);
                localStorage.setItem('productOldPrice', '');
                localStorage.setItem('productDiscount', '');
                localStorage.setItem('productDescription', book.description || 'Описание отсутствует');
                window.location.href = 'product/product.html';
            };
            card.onclick = () => {
                localStorage.setItem('productId', book.id);
                localStorage.setItem('productType', 'book');
                localStorage.setItem('productImage', imgSrc);
                localStorage.setItem('productTitle', book.title);
                localStorage.setItem('productAuthor', book.author || '');
                localStorage.setItem('productPrice', book.price);
                localStorage.setItem('productOldPrice', '');
                localStorage.setItem('productDiscount', '');
                localStorage.setItem('productDescription', book.description || 'Описание отсутствует');
                window.location.href = 'product/product.html';
            };
            container.appendChild(card);
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

// Инициализация: загрузка новинок при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    hideLoader();
    displayNewArrivals();
});
setTimeout(hideLoader, 2000);