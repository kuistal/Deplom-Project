# 📚 Geeky's - Магазин комиксов и мерча

Веб-приложение интернет-магазина комиксов и мерча, разработанное как выпускная квалификационная работа для ВШП Тверь. Проект демонстрирует навыки вёрстки, адаптивного дизайна, работы с формами и взаимодействия с данными.

## 🚀 Новое в проекте

- **Админ-панель:** вкладка "Заказы" с полной информацией о каждом заказе (пользователь, адрес, товары, сумма, дата), статистика продаж (общее количество проданных товаров).
- **Оформление заказа:** страница checkout с формой адреса и карты, визуализация карты, подтверждение заказа, очистка корзины, запись заказа и товаров в БД.
- **Профиль:** современное меню профиля с секциями "Профиль", "Заказы", "Избранное", переходы без перезагрузки, кнопка "Админ-панель" для админа.
- **Корзина:** исправлена логика добавления товаров, поддержка product_id и product_type, placeholder для отсутствующих картинок, удаление и оформление заказа.
- **Стилизация:** вынесены цвета в CSS-переменные, реализована тёмная тема, единый стиль кнопок и меню, адаптивность.
- **Диагностика и отладка:** логирование ошибок на сервере и клиенте, рекомендации по диагностике, улучшена обработка ошибок 500.
- **Работа с БД:** расширены таблицы orders и order_items, добавлены поля для адреса, реализована запись всех данных заказа.

## 📌 Описание

Интернет-магазин с ассортиментом комиксов и мерча. Пользовательский интерфейс включает:

- Главную страницу с описанием магазина
- Каталог комиксов с фильтрацией по жанрам
- Каталог мерча с фильтрацией по типам 
- Корзину покупок
- Систему авторизации и регистрации
- Личный кабинет пользователя с историей заказов, избранным, профилем
- Список избранных товаров 
- Систему отзывов 
- Контактную форму
- Страницы политики конфиденциальности, условий использования и настройки cookies
- Адаптивный дизайн
- Поддержку темной темы
- **Админ-панель:** управление пользователями, товарами, отзывами, заказами, просмотр статистики

## 🛠️ Технологии

| Технология   | Назначение                                   |
| ------------ | -------------------------------------------- |
| HTML5        | Структура страниц                            |
| CSS3         | Стилизация и адаптивность                    |
| JavaScript   | Обработка событий, динамика                  |
| Node.js      | Серверная часть                              |
| Express.js   | Web-фреймворк                                |
| MySQL        | База данных                                  |
| JWT          | Аутентификация                               |

## 💻 Установка и запуск

1. Клонируйте репозиторий:
```bash
git clone https://github.com/ваш-username/geekys-comic-store.git
cd geekys-comic-store
```

2. Установите зависимости:
```bash
npm install
```

3. Создайте базу данных MySQL и таблицы:
```sql
CREATE DATABASE bookstore;
USE bookstore;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    favorites TEXT,
    role VARCHAR(32) DEFAULT 'user'
);

CREATE TABLE books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    author VARCHAR(255),
    price DECIMAL(10,2),
    image VARCHAR(255),
    publisher VARCHAR(255),
    description TEXT,
    genres VARCHAR(255)
);

CREATE TABLE merch (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    price DECIMAL(10,2),
    image VARCHAR(255),
    description TEXT,
    filters VARCHAR(255)
);

CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    book_id INT,
    user_id INT,
    rating INT,
    review_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    type ENUM('book','merch') NOT NULL DEFAULT 'book'
);

CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    total DECIMAL(10,2),
    city VARCHAR(255),
    street VARCHAR(255),
    house VARCHAR(32),
    apartment VARCHAR(32),
    postal_code VARCHAR(32),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    product_id INT,
    product_type ENUM('book','merch'),
    price DECIMAL(10,2),
    quantity INT
);
```

4. Настройте подключение к базе данных в файле `server.js`

5. Запустите сервер:
```bash
node server.js
```

6. Откройте в браузере:
```
http://localhost:3001
```

## 📁 Структура проекта

```
Book-store-main/
│
├── home.html                     # Главная страница
├── home.css                      # Стили главной
├── home.js                       # JS логика
├── favicon.png                   # Иконка сайта
│
├── assets/                       # Графика и медиафайлы
│   └── image/                    # Изображения и логотипы
│
├── bookpage/                     # Каталог комиксов и мерча
│   ├── index.html                # Каталог книг
│   ├── merch.html                # Каталог мерча
│   ├── script.js                 # JS для книг
│   ├── merch.js                  # JS для мерча
│   ├── style.css                 # Общие стили каталога
│   ├── bookimages/               # Обложки книг
│   ├── merchimages/              # Картинки мерча
│   └── review/                   # Система отзывов
│
├── cartpage/                     # Корзина покупок, оформление заказа (checkout.html)
├── contactpage/                  # Контактная форма
├── loginform/                    # Авторизация
├── product/                      # Страница товара (общая для книг и мерча)
├── profile/                      # Личный кабинет, история заказов, избранное
│   └── wishlist/                 # Избранное (книги и мерч)
│
├── admin/                        # Админ-панель (управление, статистика, заказы)
├── FAQ/                          # Часто задаваемые вопросы
├── server.js                     # Серверная часть
└── package.json                  # Зависимости проекта
```

## 🔐 API Endpoints

- `GET /api/books` — Получение списка комиксов
- `GET /api/books?genre=marvel` — Фильтрация по жанру
- `GET /api/merch` — Получение списка мерча
- `POST /api/register` — Регистрация пользователя
- `POST /api/login` — Авторизация
- `GET /api/profile` — Получение профиля
- `GET /api/favorites` — Список избранного (книги и мерч)
- `POST /api/favorites` — Добавление/удаление из избранного
- `GET /api/reviews/:type/:id` — Получение отзывов по типу товара (книга/мерч)
- `POST /api/reviews` — Добавление отзыва (с указанием типа)
- `GET /api/products/:type/:id/similar` — Получение до 2 похожих книг и до 2 похожих мерча по совпадающим тегам для любого товара
- `POST /api/orders` — Оформление заказа
- `GET /api/orders/:userId` — История заказов пользователя
- `GET /api/admin/orders` — Получение всех заказов с деталями (админка)
- `GET /api/admin/stats` — Статистика для админки
- `GET /api/admin/users` — Список пользователей (админка)
- `GET /api/admin/products` — Список товаров (админка)
- `GET /api/admin/reviews` — Список отзывов (админка)

## 👥 Автор

Проект разработан как выпускная квалификационная работа для ВШП Тверь.

## 📄 Лицензия

MIT License. Подробности в файле [LICENSE](LICENSE).