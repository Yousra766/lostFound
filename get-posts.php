<?php
session_start();
header("Content-Type: application/json");

require "config.php";

$stmt = $conn->prepare("SELECT * FROM posts ORDER BY id DESC");
$stmt->execute();

$posts = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($posts);

?>
