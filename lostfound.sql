-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : lun. 13 avr. 2026 à 18:01
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `lostfound`
--

-- --------------------------------------------------------

--
-- Structure de la table `posts`
--

CREATE TABLE `posts` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `date` varchar(50) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `published` tinyint(1) DEFAULT 0,
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `posts`
--

INSERT INTO `posts` (`id`, `title`, `description`, `date`, `location`, `category`, `status`, `image`, `published`, `user_id`) VALUES
(1, 'Pen', 'Found in cafeteria', '2025-10-08', 'Faculty of Science', 'Stationery', 'found', 'assets/pen.png', 1, NULL),
(2, 'Glasses', 'Lost near hall', '2026-02-10', 'Class N104', 'Accessories', 'lost', 'assets/glasses.png', 0, NULL),
(5, 'Apple Watch', 'I founde the Apple Watch in the wifi Area faculty of seance', '8/10/2025', 'Faculty of science', 'Electronic', 'found', 'assets/headphones.png', 1, NULL),
(1002, 'Hat', 'Brown hat', '10/08/2025', 'Computer Science Department', 'Clothes', 'lost', 'assets/hat.png', 1, NULL),
(1003, 'Highlighter', 'Blue', '11/08/2025', 'Lecture Hall', 'Stationery', 'recovered', 'assets/Highlighter.png', 0, NULL),
(1005, 'Notebook', 'Red', '0022-02-22', 'Class N107', 'Documents', 'lost', 'http://localhost/projetphp/assets/notebook.png', 1, 8),
(1006, 'Handbag', 'Small and white', '08/01/2026', 'Class S102', 'Electronics', 'lost', 'assets/handbag.png', 1, NULL),
(1007, 'Key', 'House key', '05/11/2025', 'Class N102', 'Keys', 'lost', 'assets/key.png', 1, NULL),
(1008, 'Watch', 'Apple watch', '25/01/2026', 'Class S102', 'Clothes', 'lost', 'assets/watch.png', 0, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `role` varchar(20) DEFAULT 'user',
  `avatar` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `phone`, `password`, `created_at`, `role`, `avatar`) VALUES
(1, 'A', 'A@gmail.com', '00028336666', '$2y$10$PDMkHdtTti0AmHGidsxafuFWaYujtMsuALZSdAL1RUXEwjv4MQxcO', '2026-03-06 22:05:23', 'user', NULL),
(2, 'B', 'B@gmail.com', '00028336668', '$2y$10$lNEC4ls39AYLPiuZ9g3mEuv9h.1QIlDphx9jzdQEG2glM.KTX2nw2', '2026-03-06 22:35:53', 'user', NULL),
(3, 'C', 'C@gmail.com', '00028336669', '$2y$10$qM0EYvLo6B8L8rSN2TWGTODR90jeDVty2FX/Ll5GEj/ok.SxKZ2NC', '2026-03-06 22:37:49', 'user', NULL),
(5, 'D', 'D@gmail.com', '00028336666', '$2y$10$.EcaqHQFIcH940rPsFp00ua5XjdH3RmCOWDfS/k.i5ggL7gP1Orp.', '2026-03-06 22:48:44', 'user', NULL),
(6, 'NN', 'NN@gmail.com', '00028336669', '$2y$10$wp6UK0tCGufIwhtuMH93Be/w90FpAswNa8P2lz1ctmn70nG2Moa7a', '2026-03-13 16:13:42', 'user', NULL),
(7, 'admin', 'admin123@gmail.com', '1111111111111', '$2y$10$UoJxEtjjOo5R6UY2JwamYOfzW7UWdkvCDN5GJj3J.QB0Wr1me.pem', '2026-04-12 09:23:27', 'admin', NULL),
(8, 'user', 'user123@gmail.com', '22222222222', '$2y$10$t6Mypk07wW9DnQKVA.x47Oypu2heDJoM6HSVCNI0b4DvYm4zmFcsu', '2026-04-12 19:44:41', 'user', NULL);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `posts`
--
ALTER TABLE `posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1012;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
