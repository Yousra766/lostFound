<?php
session_start();
require "config.php";

$data = json_decode(file_get_contents("php://input"), true);

$user_id = $_SESSION['user_id'];

$stmt = $conn->prepare("
    INSERT INTO posts 
    (user_id, title, description, date, location, category, status, image, published)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)
");

$stmt->execute([
    $user_id,
    $data['title'],
    $data['description'],
    $data['date'],
    $data['location'],
    $data['category'],
    $data['status'],
    $data['image']
]);

echo json_encode(["msg" => "Post created"]);
?>
