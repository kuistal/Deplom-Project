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

// Функция для загрузки books.json
async function fetchBooks() {
    try {
        const response = await fetch('bookpage/books.json');
        if (!response.ok) throw new Error('Не удалось загрузить книги');
        const books = await response.json();
        return books;
    } catch (error) {
        console.error('Ошибка:', error);
        return [];
    }
}

// Переменные для карусели
let currentIndex = 0;
const booksPerPage = 3;

// Функция для отображения карточек новинок
async function displayNewArrivals() {
    const books = await fetchBooks();
    const container = document.getElementById('new-collection');
    container.innerHTML = '';

    const newArrivals = books.slice(currentIndex, currentIndex + booksPerPage);

    newArrivals.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.className = 'collection-book';
        bookCard.innerHTML = `
            <div class="collection-img">
                <img src="bookpage/${book.image_url}" alt="${book.title}" loading="lazy" onerror="this.src='bookpage/placeholder.jpg';">
            </div>
            <div class="collection-content">
                <div class="collection-content-detail">
                    <div>
                        <h5>${book.title}</h5>
                        <p>${book.publisher}</p>
                    </div>
                    <div>
                        <h6>₹ ${book.price}</h6>
                    </div>
                </div>
                <div>
                    <a href="#" class="view-book-link">Купить</a>
                </div>
            </div>
        `;
        container.appendChild(bookCard);
    });

    updateCarouselButtons(books.length);
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