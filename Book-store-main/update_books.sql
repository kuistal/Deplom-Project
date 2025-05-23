-- Проверяем наличие колонки genre
ALTER TABLE books ADD COLUMN IF NOT EXISTS genre VARCHAR(50);

-- Обновляем существующие записи с жанрами
UPDATE books SET genre = 'marvel' WHERE LOWER(title) LIKE '%marvel%';
UPDATE books SET genre = 'dc' WHERE LOWER(title) LIKE '%dc%' OR LOWER(title) LIKE '%batman%' OR LOWER(title) LIKE '%superman%';
UPDATE books SET genre = 'bubble' WHERE LOWER(title) LIKE '%bubble%' OR LOWER(publisher) LIKE '%bubble%';
UPDATE books SET genre = 'star-wars' WHERE LOWER(title) LIKE '%star wars%' OR LOWER(title) LIKE '%звездные войны%';
UPDATE books SET genre = 'boys' WHERE LOWER(title) LIKE '%boys%' OR LOWER(title) LIKE '%пацаны%';
UPDATE books SET genre = 'phoenix' WHERE LOWER(publisher) LIKE '%феникс%' OR LOWER(title) LIKE '%феникс%'; 