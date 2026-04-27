<?php
session_start();
header("Content-Type: application/json");
require "config.php";

$data = json_decode(file_get_contents("php://input"), true);

$id = $data['id'] ?? null;

if (!$id) {
    echo json_encode(["msg" => "Missing id"]);
    exit;
}

// get current state
$stmt = $conn->prepare("SELECT published FROM posts WHERE id = ?");
$stmt->execute([$id]);
$post = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$post) {
    echo json_encode(["msg" => "not found"]);
    exit;
}

// toggle
$newState = $post['published'] == 1 ? 0 : 1;

$stmt = $conn->prepare("UPDATE posts SET published = ? WHERE id = ?");
$stmt->execute([$newState, $id]);

echo json_encode([
    "msg" => "updated",
    "published" => $newState
]);
?>
