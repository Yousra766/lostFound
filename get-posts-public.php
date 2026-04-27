<?php
require "config.php";
header("Content-Type: application/json");

// On récupère les filtres envoyés par le JavaScript
$search = $_GET['search'] ?? "";
$category = $_GET['category'] ?? "";
$status = $_GET['status'] ?? ""; // On récupère 'lost' ou 'found'

// Requête de base : on veut seulement les posts publiés
$sql = "SELECT * FROM posts WHERE published = 1";

// Filtre de statut (très important pour séparer les pages Lost et Found)
if (!empty($status)) {
    $sql .= " AND status = :status";
}

// Filtre de recherche par mot-clé
if (!empty($search)) {
    $sql .= " AND (title LIKE :search OR description LIKE :search OR location LIKE :search)";
}

// Filtre par catégorie exacte
if (!empty($category)) {
    $sql .= " AND category = :category";
}

$stmt = $conn->prepare($sql);

// On lie les valeurs si elles existent
if (!empty($status)) {
    $stmt->bindValue(':status', $status);
}

if (!empty($search)) {
    $stmt->bindValue(':search', "%$search%");
}

if (!empty($category)) {
    $stmt->bindValue(':category', $category);
}

$stmt->execute();

// On renvoie le résultat en JSON
echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
?>