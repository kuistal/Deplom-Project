const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const reviewsRouter = require('./reviews');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const SECRET = 'g7F!2kLz9pQwXyVbR4sT1uJmN8eHcSdA'; // Секретный ключ для JWT

const app = express();
app.use(cors());
app.use(express.json());

// Serve all static files from the root directory
app.use(express.static(__dirname));

// Serve static files from the bookpage directory
app.use('/bookpage', express.static(path.join(__dirname, 'bookpage')));
// Serve images from bookimages directory
app.use('/bookimages', express.static(path.join(__dirname, 'bookpage/bookimages')));
// Serve placeholder image
app.use('/placeholder.jpg', express.static(path.join(__dirname, 'bookpage/placeholder.jpg')));
// Serve images from merchimages directory
app.use('/merchimages', express.static(path.join(__dirname, 'bookpage/merchimages')));

// Store favorites in memory (in a real app, this would be in a database)
const userFavorites = new Map();

const dbConfig = {
    host: 'localhost',
    port: 3306,
    user: 'bookuser',         
    password: 'BookPass123!',
    database: 'bookstore',
    charset: 'utf8mb4'
};

// Новый /api/books через MySQL:
app.get('/api/books', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [books] = await connection.execute('SELECT * FROM books');
        await connection.end();
        res.json(books);
    } catch (error) {
        console.error('Error serving books:', error);
        res.status(500).json({ error: 'Failed to load books' });
    }
});

// Get user favorites
app.get('/api/favorites', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.json([]);
    }
    res.json(userFavorites.get(token) || []);
});

// Toggle favorite
app.post('/api/favorites', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    const { bookId } = req.body;
    
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    let favorites = userFavorites.get(token) || [];
    const index = favorites.indexOf(bookId);
    
    if (index === -1) {
        favorites.push(bookId);
    } else {
        favorites.splice(index, 1);
    }
    
    userFavorites.set(token, favorites);
    res.json({ favorites });
});

// Регистрация
app.post('/api/register', async (req, res) => {
    const { username, password, name, email } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Missing fields' });
    const connection = await mysql.createConnection(dbConfig);
    const [users] = await connection.execute('SELECT * FROM users WHERE username = ?', [username]);
    if (users.length > 0) {
        await connection.end();
        return res.status(409).json({ error: 'User already exists' });
    }
    const hash = await bcrypt.hash(password, 10);
    await connection.execute(
        'INSERT INTO users (username, password, name, email) VALUES (?, ?, ?, ?)',
        [username, hash, name || '', email || '']
    );
    await connection.end();
    res.json({ success: true });
});

// Авторизация
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Missing fields' });
    const connection = await mysql.createConnection(dbConfig);
    const [users] = await connection.execute('SELECT * FROM users WHERE username = ?', [username]);
    await connection.end();
    if (users.length === 0) return res.status(401).json({ error: 'User not found' });
    const user = users[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid password' });
    const token = jwt.sign({ id: user.id, username: user.username }, SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, username: user.username, name: user.name, email: user.email, role: user.role } });
});

app.use('/api/reviews', reviewsRouter);

// Новый /api/merch через MySQL:
app.get('/api/merch', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [merch] = await connection.execute('SELECT * FROM merch');
        await connection.end();
        res.json(merch);
    } catch (error) {
        console.error('Error serving merch:', error);
        res.status(500).json({ error: 'Failed to load merch' });
    }
});

// Главная страница
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'home.html'));
});

// Эндпоинт статистики для админки
app.get('/api/admin/stats', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        // Считаем пользователей
        const [[{ userCount }]] = await connection.execute('SELECT COUNT(*) as userCount FROM users');
        // Считаем книги
        const [[{ bookCount }]] = await connection.execute('SELECT COUNT(*) as bookCount FROM books');
        // Считаем мерч
        const [[{ merchCount }]] = await connection.execute('SELECT COUNT(*) as merchCount FROM merch');
        // Считаем отзывы
        const [[{ reviewCount }]] = await connection.execute('SELECT COUNT(*) as reviewCount FROM reviews');
        await connection.end();
        res.json({
            users: userCount,
            products: bookCount + merchCount,
            reviews: reviewCount
        });
    } catch (e) {
        res.status(500).json({ error: 'Ошибка получения статистики' });
    }
});

// Эндпоинт для получения всех пользователей (админка)
app.get('/api/admin/users', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [users] = await connection.execute('SELECT id, username, name, email, role FROM users');
        await connection.end();
        res.json(users);
    } catch (e) {
        res.status(500).json({ error: 'Ошибка получения пользователей' });
    }
});

// Удаление пользователя (админка)
app.delete('/api/admin/users/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const connection = await mysql.createConnection(dbConfig);
        await connection.execute('DELETE FROM users WHERE id = ?', [userId]);
        await connection.end();
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: 'Ошибка удаления пользователя' });
    }
});

// Эндпоинт для получения всех товаров (книги и мерч) для админки
app.get('/api/admin/products', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [books] = await connection.execute("SELECT id, title, price, image, 'book' as type FROM books");
        const [merch] = await connection.execute("SELECT id, title, price, image, 'merch' as type FROM merch");
        await connection.end();
        const products = [...books, ...merch];
        res.json(products);
    } catch (e) {
        res.status(500).json({ error: 'Ошибка получения товаров' });
    }
});

// Настройки хранения для книг и мерча
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const type = req.body.type;
        if (type === 'book') {
            cb(null, path.join(__dirname, 'bookpage/bookimages'));
        } else {
            cb(null, path.join(__dirname, 'bookpage/merchimages'));
        }
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, uuidv4() + ext);
    }
});
const upload = multer({ storage });

// Добавление товара (книга или мерч) с загрузкой картинки
app.post('/api/admin/products', upload.single('image'), async (req, res) => {
    const type = req.body.type;
    if (type !== 'book' && type !== 'merch') return res.status(400).json({ error: 'Некорректный тип товара' });
    try {
        const connection = await mysql.createConnection(dbConfig);
        let imagePath;
        if (type === 'book') {
            imagePath = '/bookimages/' + req.file.filename;
            await connection.execute(
                'INSERT INTO books (title, price, image, author, genres, description) VALUES (?, ?, ?, ?, ?, ?)',
                [req.body.title, req.body.price, imagePath, req.body.author, req.body.genres, req.body.description]
            );
        } else {
            imagePath = '/merchimages/' + req.file.filename;
            await connection.execute(
                'INSERT INTO merch (title, price, image, description, filters) VALUES (?, ?, ?, ?, ?)',
                [req.body.title, req.body.price, imagePath, req.body.description, req.body.filters]
            );
        }
        await connection.end();
        res.json({ success: true });
    } catch (e) {
        console.error('Ошибка добавления товара:', e);
        res.status(500).json({ error: 'Ошибка добавления товара' });
    }
});

// Удаление товара (книга или мерч) по id и типу (админка)
app.delete('/api/admin/products/:type/:id', async (req, res) => {
    const { type, id } = req.params;
    if (type !== 'book' && type !== 'merch') return res.status(400).json({ error: 'Некорректный тип товара' });
    try {
        const connection = await mysql.createConnection(dbConfig);
        const table = type === 'book' ? 'books' : 'merch';
        await connection.execute(`DELETE FROM \`${table}\` WHERE id = ?`, [id]);
        await connection.end();
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: 'Ошибка удаления товара' });
    }
});

// Получить товар по id и типу (админка)
app.get('/api/admin/products/:type/:id', async (req, res) => {
    const { type, id } = req.params;
    if (type !== 'book' && type !== 'merch') return res.status(400).json({ error: 'Некорректный тип товара' });
    try {
        const connection = await mysql.createConnection(dbConfig);
        const table = type === 'book' ? 'books' : 'merch';
        const [rows] = await connection.execute(`SELECT * FROM \`${table}\` WHERE id = ?`, [id]);
        await connection.end();
        if (!rows.length) return res.status(404).json({ error: 'Товар не найден' });
        res.json(rows[0]);
    } catch (e) {
        res.status(500).json({ error: 'Ошибка получения товара' });
    }
});

// Редактировать товар по id и типу (админка)
app.patch('/api/admin/products/:type/:id', async (req, res) => {
    const { type, id } = req.params;
    const data = req.body;
    if (type !== 'book' && type !== 'merch') return res.status(400).json({ error: 'Некорректный тип товара' });
    try {
        const connection = await mysql.createConnection(dbConfig);
        let sql, params;
        if (type === 'book') {
            sql = `UPDATE \`books\` SET title=?, price=?, image=?, author=?, publisher=?, genres=?, description=? WHERE id=?`;
            params = [data.title, data.price, data.image, data.author, data.publisher, data.genres, data.description, id];
        } else {
            sql = `UPDATE \`merch\` SET title=?, price=?, image=?, description=?, filters=? WHERE id=?`;
            params = [data.title, data.price, data.image, data.description, data.filters, id];
        }
        await connection.execute(sql, params);
        await connection.end();
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: 'Ошибка сохранения товара' });
    }
});

// Эндпоинт для получения всех отзывов (админка)
app.get('/api/admin/reviews', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [reviews] = await connection.execute(`
            SELECT r.id, r.user_id, u.username, r.review_text, r.rating, r.type, r.created_at, r.book_id
            FROM reviews r
            LEFT JOIN users u ON r.user_id = u.id
            ORDER BY r.created_at DESC
        `);
        await connection.end();
        res.json(reviews);
    } catch (e) {
        res.status(500).json({ error: 'Ошибка получения отзывов' });
    }
});

// Удаление отзыва по id (админка)
app.delete('/api/admin/reviews/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const connection = await mysql.createConnection(dbConfig);
        await connection.execute('DELETE FROM reviews WHERE id = ?', [id]);
        await connection.end();
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: 'Ошибка удаления отзыва' });
    }
});

// === Похожие товары (книги и мерч) ===
app.get('/api/products/:type/:id/similar', async (req, res) => {
    const { type, id } = req.params;
    if (type !== 'book' && type !== 'merch') return res.status(400).json({ error: 'Некорректный тип товара' });
    try {
        const connection = await mysql.createConnection(dbConfig);
        let current, currentTags = [];
        if (type === 'book') {
            const [rows] = await connection.execute('SELECT * FROM books WHERE id = ?', [id]);
            if (!rows.length) return res.status(404).json({ error: 'Товар не найден' });
            current = rows[0];
            currentTags = (current.genres || '').split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
        } else {
            const [rows] = await connection.execute('SELECT * FROM merch WHERE id = ?', [id]);
            if (!rows.length) return res.status(404).json({ error: 'Товар не найден' });
            current = rows[0];
            currentTags = (current.filters || '').split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
        }
        // Получаем все остальные товары
        const [books] = await connection.execute('SELECT id, title, price, image, genres, "book" as type FROM books WHERE id != ?', [type === 'book' ? id : 0]);
        const [merch] = await connection.execute('SELECT id, title, price, image, filters, "merch" as type FROM merch WHERE id != ?', [type === 'merch' ? id : 0]);
        // Считаем релевантность по совпадению тегов
        const scored = [...books, ...merch].map(item => {
            const tags = (item.type === 'book' ? item.genres : item.filters) || '';
            const tagArr = tags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
            const score = tagArr.filter(tag => currentTags.includes(tag)).length;
            return { ...item, score };
        }).filter(b => b.score > 0 && !(b.type === type && String(b.id) === String(id)));
        // Теперь берём до 2 книг и до 2 мерча
        const booksScored = scored.filter(b => b.type === 'book').sort((a, b) => b.score - a.score).slice(0, 2);
        const merchScored = scored.filter(b => b.type === 'merch').sort((a, b) => b.score - a.score).slice(0, 2);
        await connection.end();
        res.json([...booksScored, ...merchScored]);
    } catch (e) {
        res.status(500).json({ error: 'Ошибка поиска похожих товаров' });
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
}); 