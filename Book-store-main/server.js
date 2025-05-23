const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',      // ваш пользователь
  password: 'Qwerty100.',      // ваш пароль
  database: 'bookstore'
});

app.get('/api/books', (req, res) => {
  const { genre } = req.query;
  let query = 'SELECT * FROM books';
  let params = [];

  if (genre && genre !== 'all') {
    query += ' WHERE LOWER(genre) = LOWER(?)';
    params.push(genre);
  }

  console.log('Executing query:', query);
  console.log('With params:', params);

  db.query(query, params, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: err.message });
    }
    console.log('Found books:', results.length);
    res.json(results);
  });
});

// Регистрация
app.post('/api/register', (req, res) => {
  const { username, password, name, email } = req.body;
  if (!username || !password || !name || !email) {
    return res.status(400).json({ error: 'Все поля обязательны' });
  }
  const hash = bcrypt.hashSync(password, 10);
  db.query(
    'INSERT INTO users (username, password, name, email) VALUES (?, ?, ?, ?)',
    [username, hash, name, email],
    (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({ error: 'Пользователь с таким логином или почтой уже существует' });
        }
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Регистрация успешна' });
    }
  );
});

// Авторизация
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  db.query(
    'SELECT * FROM users WHERE username = ?',
    [username],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0) return res.status(401).json({ error: 'Неверный логин или пароль' });
      const user = results[0];
      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ error: 'Неверный логин или пароль' });
      }
      const token = jwt.sign({ id: user.id, username: user.username }, 'SECRET_KEY', { expiresIn: '1d' });
      res.json({ message: 'Успешный вход', token, user: { id: user.id, username: user.username, name: user.name, email: user.email, favorites: user.favorites } });
    }
  );
});

// Профиль
app.get('/api/profile', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Нет токена' });
  try {
    const decoded = jwt.verify(auth.split(' ')[1], 'SECRET_KEY');
    db.query('SELECT id, username, name, email, favorites FROM users WHERE id = ?', [decoded.id], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0) return res.status(404).json({ error: 'Пользователь не найден' });
      res.json(results[0]);
    });
  } catch {
    res.status(401).json({ error: 'Неверный токен' });
  }
});

// Получить избранные книги пользователя
app.get('/api/favorites', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Нет токена' });
  try {
    const decoded = jwt.verify(auth.split(' ')[1], 'SECRET_KEY');
    db.query('SELECT favorites FROM users WHERE id = ?', [decoded.id], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0) return res.status(404).json({ error: 'Пользователь не найден' });
      const favorites = results[0].favorites ? JSON.parse(results[0].favorites) : [];
      res.json(favorites);
    });
  } catch {
    res.status(401).json({ error: 'Неверный токен' });
  }
});

// Добавить/удалить книгу из избранного
app.post('/api/favorites', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Нет токена' });
  try {
    const decoded = jwt.verify(auth.split(' ')[1], 'SECRET_KEY');
    const { bookId } = req.body;
    db.query('SELECT favorites FROM users WHERE id = ?', [decoded.id], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0) return res.status(404).json({ error: 'Пользователь не найден' });
      let favorites = results[0].favorites ? JSON.parse(results[0].favorites) : [];
      if (favorites.includes(bookId)) {
        favorites = favorites.filter(id => id !== bookId); // удалить
      } else {
        favorites.push(bookId); // добавить
      }
      db.query('UPDATE users SET favorites = ? WHERE id = ?', [JSON.stringify(favorites), decoded.id], (err2) => {
        if (err2) return res.status(500).json({ error: err2.message });
        res.json({ favorites });
      });
    });
  } catch {
    res.status(401).json({ error: 'Неверный токен' });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 