-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: bookstore
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `books`
--

DROP TABLE IF EXISTS `books`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `books` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `author` varchar(255) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `genres` varchar(255) DEFAULT NULL,
  `description` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `books`
--

LOCK TABLES `books` WRITE;
/*!40000 ALTER TABLE `books` DISABLE KEYS */;
INSERT INTO `books` VALUES (1,'БРАТ: 25 лет Книга комиксов','Bubble Comics Team',800.00,'/bookimages/ne-brat-ti-mne.png','Comics,Bubble,Юбилейное издание','Юбилейное издание, посвящённое 25-летию Bubble Comics, включает ключевые моменты истории издательства.'),(2,'Локи в Президенты','Хастич Фосс, Маккфорни Уэлфри, Чакир',500.00,'../bookpage/bookimages/meik-marvel-greit-agen.png','Comics,Marvel,фантастика,Сатира','Локи, бог хитрости, баллотируется в президенты — сатирический взгляд на политику Marvel.'),(3,'Ловец Бабочек','Анастасия Ким',400.00,'../bookpage/bookimages/bug-hunter.png','Comics,фантастика,Приключение','История о ловце бабочек в мире фантазий и тайн.'),(4,'Gotham Тихо!','Джеф Лоуб, Джим Ли, Скотт Уильямс',600.00,'../bookpage/bookimages/beatmen-sailens.png','Comics,Dc,Супергерой,детектив','Бэтмен сталкивается с новыми угрозами в мрачном Готэме.'),(5,'Майор Гром: Чумной Доктор','Bubble Comics Team',450.00,'../bookpage/bookimages/maior-Grom.png','Comics,Bubble,Экшен,Триллер','Майор Гром противостоит Чумному Доктору в напряжённом триллере.'),(6,'Хранители','Аллан Мур',550.00,'../bookpage/bookimages/hraniteli.png','Comics,Супергерой,Приключение','История Дэйн Пибонс, одного из лучших романов XX века.'),(7,'Бэтмен: Убийственная Шутка','Адам Мур, Брайан Болланд',700.00,'../bookpage/bookimages/killing-joyk.png','Comics,Dc,Супергерой,Триллер','Культовый комикс о противостоянии Бэтмена и Джокера.'),(8,'Зайчик','Дмитрий Мордас',400.00,'../bookpage/bookimages/bunny.png','Comics,Триллер,детектив','Таинственная история о человеке с маской зайца в мрачном лесу.'),(9,'Лунный Рыцарь','Брайан Майкл Бендис, Алекс Малеев',600.00,'../bookpage/bookimages/moon-night.png','Comics,Marvel,Супергерой,Экшен','Лунный Рыцарь сражается с врагами, балансируя на грани безумия.'),(10,'Джон Константин Hellblazer','Гарт Эннис, Уилл Симпсон, Джейми Делано, Стив Диллон',650.00,'../bookpage/bookimages/hellbleizer.png','Comics,Dc,Ужасы,детектив','Джон Константин сталкивается с демонами и своими пороками.'),(11,'Человек-Паук 1994: Новые Приключения','Marvel Comics Team',500.00,'../bookpage/bookimages/Spider-men1994.png','Comics,Marvel,Супергерой,Экшен,Spider-Man','Новые приключения Человека-Паука в 1994 году, где он сражается с Веномом и Доктором Осьминогом.'),(12,'История России в Комиксах','Команда Бомбора',600.00,'../bookpage/bookimages/russian-story.png','Comics,История,Образование','История России в формате комиксов, охватывающая период от древних славян до современной эпохи.'),(13,'Что если Веном завладел Дедпулом','Ремендер Рик',550.00,'../bookpage/bookimages/what-is-Venom.png','Comics,Marvel,Супергерой,Экшен','Встречайте, легендарные Веном и Дэдпул в одном выпуске! Они были созданы в одну эпоху, но при этом являются полными противоположностями.'),(14,'Магическая битва. Книга 1','Акутами Гэгэ',865.00,'../bookpage/bookimages/madjic-fight.png','Manga,Сёнэн,Боевик','Юдзи Итадори – обычный старшеклассник. И хотя мальчик от рождения обладает выдающимися физическими данными, спорт его совсем не интересует. Юноша предпочитает проводить время со своими друзьями в Клубе исследователей паранормальных явлений. Однажды в руки школьников попадает высушенный палец Двуликого Сукуны, короля проклятий. И с этой секунды жизнь Итадори начинает круто меняться: Юдзи становится частью невиданного ранее мира… Мира магии и заклинаний..'),(15,'Берсерк. Том 1','Кэнтаро Миура',600.00,'../bookpage/bookimages/Berserck.png','Manga,Сёнэн,Боевик,Ужасы','Одинокий воин, облаченный во все черное и с огромным, в человеческий рост, мечом за спиной, странствует по свету, верша свою месть силам зла. Там, где проходит его путь, неизменно остаются горы трупов, а кровь льется рекой.'),(16,'Наруто. Книга 1','Масаси Кисимото',900.00,'../bookpage/bookimages/Naruto.png','Manga,Сёнэн,naruto,Боевик,Драма,Комедия','Наруто Удзумаки – самый проблемный ученик академии ниндзя в деревне Коноха. День за днем он выдумывает всяческие проказы и выводит из себя окружающих! Однако даже у этого хулигана есть заветная мечта. Он собирается превзойти героев прошлого, стать величайшим ниндзя и обрести всеобщее признание! '),(18,'Нечто убивает детей (Эксклюзивное издание в твердом переплете)','Джеймс Тайнион IV',1800.00,'/bookimages/a3267170-2be6-49d8-bff9-336c59876426.jpg','Comics,Триллер,Боевик,Ужасы','[\"Когда в сонном городке посреди Америки начинают пропадать дети, кажется, что всё безнадёжно. Большинство детей исчезают навсегда, однако те немногие, кому удалось вернуться, рассказывают кошмарные истории об ужасающих существах, что обитают в тенях. Единственная, кто может остановить этих чудовищ, — это загадочная незнакомка, утверждающая, что видит то же, что и выжившие дети. Её зовут Эрика Бойня, она убивает чудовищ. Это всё, чем она занимается. И, поверьте, такое ремесло дорого ей обходится.\",\"\"]');
/*!40000 ALTER TABLE `books` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `merch`
--

DROP TABLE IF EXISTS `merch`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `merch` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `description` text,
  `image` varchar(255) DEFAULT NULL,
  `filters` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `merch`
--

LOCK TABLES `merch` WRITE;
/*!40000 ALTER TABLE `merch` DISABLE KEYS */;
INSERT INTO `merch` VALUES (1,'Funko POP! Marvel. Thunderbolts: Sentry',2250.00,'Около 12 см в высоту. Забавная и качественная коллекционная фигурка серии POP! от Funko','/merchimages/FunkoPOP!-Sentry.jpg','фигурка,Marvel,funko'),(2,'Funko POP! Marvel. Thunderbolts: Bucky Barnes',2250.00,'Около 12 см в высоту. Забавная и качественная коллекционная фигурка серии POP! от Funko.','/merchimages/Funko-POP!-Bucky-Barnes.jpg','фигурка,Мarvel,funko'),(3,'Funko POP! Marvel. Thunderbolts: Red Guardian',2250.00,'Около 12 см в высоту. Забавная и качественная коллекционная фигурка серии POP! от Funko.','/merchimages/Funko-POP!-Red.Guardian.jpg','фигурка,Мarvel,funko'),(4,'Funko POP! Marvel. Thunderbolts: Yelena Belova',2250.00,'Около 12 см в высоту. Забавная и качественная коллекционная фигурка серии POP! от Funko.','/merchimages/Funko-POP!Yelena.Belova.jpg','фигурка,Marvel,funko'),(5,'Уточка Tubbz: DC - The Joker',2800.00,'Tubbz – это фигурки, в которых персонажи из любимых фильмов, сериалов, игр и массовой культуры оживают в виде уток.','/merchimages/Tubbz-TheJoker.jpg','фигурка,Dc,tubbz'),(6,'Уточка Tubbz: Hatsune Miku',2690.00,'Tubbz – это фигурки, в которых персонажи из любимых фильмов, сериалов, игр и массовой культуры оживают в виде уток','/merchimages/Tubbz-Hatsune-Miku.jpg','фигурка,аниме,tubbz'),(7,'Уточка Tubbz: DC - Harley Quinn',2390.00,'Tubbz – это фигурки, в которых персонажи из любимых фильмов, сериалов, игр и массовой культуры оживают в виде уток.','/merchimages/Tubbz-DC-Harley-Quinn.jpg','фигурка,Dc,tubbz'),(8,'Виниловая пластинка. OST – Neon Genesis Evangelion (Shiro Sagisu)',9999.00,'· Лимитированное издание на цветном виниле','/merchimages/OST – Neon-Genesis-Evangelion.jpg','винил,аниме,evangelion'),(9,'Виниловая пластинка. OST – Twilight',7999.00,'Саундтрек издан на цветном виниле','/merchimages/OST–Twilight.jpg','винил,саундтрек,twilight'),(10,'Виниловая пластинка. OST – The Dota 2 Official Soundtrack',6990.00,'Саундтрек издан на цветном виниле','/merchimages/OST–The-Dota-2.jpg','винил,саундтрек,dota2'),(11,'Набор карточек \"Heaven Official\'s Blessing\"',350.00,'Набор коллекционных карточек по маньхуа \"Благословение Небожителей\"','/merchimages/Heaven-Officials-Blessing.jpg','карточки,маньхуа,heaven'),(12,'Набор карточек \"Chainsaw Man\"',350.00,'Набор карточек \"Человек-Бензопила\".','/merchimages/Chainsaw-Man.jpg','карточки,аниме,chainsawman'),(13,'Набор карточек \"Naruto\" Premium',350.00,'Набор лицензионных карточек \"Naruto\" от Kayou.','/merchimages/Naruto-Premium.jpg','карточки,аниме,naruto'),(14,'Фигурка Человек-Паук — Marvel Gallery: Spider-Man PVC Statue',8990.00,'Характеристики:\r\nВысота: 25 см\r\nМатериал: пластик\r\nОригинальный и официально лицензированный продукт\r\nБренд: Diamond Select','/merchimages/e77ee031-1ce8-4692-82e4-712e2ded8e0d.jpg','фигурка,Marvel,Action фигурка,Spider-Man');
/*!40000 ALTER TABLE `merch` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `product_type` enum('book','merch') NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `idx_order_items_order_id` (`order_id`),
  KEY `idx_order_items_product_id` (`product_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (1,6,2,'book',500.00,1),(2,7,5,'book',450.00,1);
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `city` varchar(100) DEFAULT NULL,
  `street` varchar(100) DEFAULT NULL,
  `house` varchar(20) DEFAULT NULL,
  `apartment` varchar(20) DEFAULT NULL,
  `postal_code` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (6,1,500.00,'2025-06-02 23:57:16','Тверь','Красино ','22','11','010003'),(7,1,450.00,'2025-06-03 00:18:18','KAZAHSTAN','Красино ','22','11','010003');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `id` int NOT NULL AUTO_INCREMENT,
  `book_id` int NOT NULL,
  `user_id` int NOT NULL,
  `rating` int NOT NULL,
  `review_text` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `type` enum('book','merch') NOT NULL DEFAULT 'book',
  PRIMARY KEY (`id`),
  KEY `book_id` (`book_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`),
  CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `reviews_chk_1` CHECK ((`rating` between 1 and 5))
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` VALUES (1,2,1,5,'Купить','2025-05-25 17:26:46','book'),(2,1,1,5,'крутая книга','2025-05-25 18:37:58','book'),(3,5,2,5,'ЧИИТАЛА В ЗАХЛЁБ','2025-05-25 18:38:51','book');
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `favorites` text,
  `role` enum('user','admin') DEFAULT 'user',
  `status` enum('active','blocked') DEFAULT 'active',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'kuistal','$2b$10$eq9Bj8VTJtv10mHHpQu2puuvVoYdkx9FcZ0unV1jtUD91XwoE37AK','artemy','Starvars9@mail.ru',NULL,'admin','active'),(2,'VeronaSai','$2b$10$9W8/2IUVhaMM1L6KmaDk7OMaUYOyLoCsCVAK1DM4XRdBe1yjPDY5G','Veranika','Veronik@mail.ru','[]','user','active');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-04 14:02:46
