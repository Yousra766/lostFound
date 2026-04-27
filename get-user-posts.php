<?php
session_start();
header("Content-Type: application/json");

require "config.php";

if(!isset($_SESSION['user_id'])){
    echo json_encode([]);
    exit;
}

$user_id = $_SESSION['user_id'];

$stmt = $conn->prepare("
    SELECT * FROM posts 
    WHERE user_id = ? AND published = 1
    ORDER BY id DESC
");

$stmt->execute([$user_id]);

echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
?>
