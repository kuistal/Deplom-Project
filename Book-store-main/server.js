const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const reviewsRouter = require('./reviews');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');

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
    res.json({ token, user: { id: user.id, username: user.username, name: user.name, email: user.email } });
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

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
}); 