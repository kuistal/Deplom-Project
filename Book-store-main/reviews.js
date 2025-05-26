const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    port: 3306,
    user: 'bookuser',         
    password: 'BookPass123!',
    database: 'bookstore'
};

// Новый маршрут для получения отзывов с учётом типа
router.get('/:type/:id', async (req, res) => {
    const { type, id } = req.params;
    const connection = await mysql.createConnection(dbConfig);
    const [reviews] = await connection.execute(
        `SELECT r.rating, r.review_text, r.created_at, u.username
         FROM reviews r
         JOIN users u ON r.user_id = u.id
         WHERE r.book_id = ? AND r.type = ?
         ORDER BY r.created_at DESC`, [id, type]
    );
    const [avg] = await connection.execute(
        `SELECT AVG(rating) as avg_rating, COUNT(*) as review_count
         FROM reviews WHERE book_id = ? AND type = ?`, [id, type]
    );
    await connection.end();
    res.json({
        reviews,
        avg_rating: avg[0].avg_rating,
        review_count: avg[0].review_count
    });
});

// Старый маршрут (если нужен)
router.get('/:bookId', async (req, res) => {
    const bookId = req.params.bookId;
    const connection = await mysql.createConnection(dbConfig);
    const [reviews] = await connection.execute(
        `SELECT r.rating, r.review_text, r.created_at, u.username
         FROM reviews r
         JOIN users u ON r.user_id = u.id
         WHERE r.book_id = ?
         ORDER BY r.created_at DESC`, [bookId]
    );
    const [avg] = await connection.execute(
        `SELECT AVG(rating) as avg_rating, COUNT(*) as review_count
         FROM reviews WHERE book_id = ?`, [bookId]
    );
    await connection.end();
    res.json({
        reviews,
        avg_rating: avg[0].avg_rating,
        review_count: avg[0].review_count
    });
});

// Добавить отзыв с учётом типа
router.post('/', async (req, res) => {
    const { book_id, user_id, rating, review_text, type } = req.body;
    if (!book_id || !user_id || !rating || !type) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    const connection = await mysql.createConnection(dbConfig);
    await connection.execute(
        `INSERT INTO reviews (book_id, user_id, rating, review_text, type)
         VALUES (?, ?, ?, ?, ?)`,
        [book_id, user_id, rating, review_text, type]
    );
    await connection.end();
    res.json({ success: true });
});

module.exports = router; 