<?php
session_start();
require "config.php";

$data = json_decode(file_get_contents("php://input"), true);

$user_id = $_SESSION['user_id'];

$stmt = $conn->prepare("
    UPDATE posts 
    SET title=?, description=?, date=?, location=?, category=?, status=?, image=?
    WHERE id=? AND user_id=?
");

$stmt->execute([
    $data['title'],
    $data['description'],
    $data['date'],
    $data['location'],
    $data['category'],
    $data['status'],
    $data['image'],
    $data['id'],
    $user_id
]);

echo json_encode(["msg" => "updated"]);
?>
