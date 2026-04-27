<?php
session_start();
header("Content-Type: application/json");

require "config.php";

$data = json_decode(file_get_contents("php://input"), true);

$id = $data['id'] ?? null;
$user_id = $_SESSION['user_id'] ?? 1; // 🔥 TEMP FIX

if (!$id) {
    echo json_encode(["msg" => "Missing id"]);
    exit;
}

$stmt = $conn->prepare("
    DELETE FROM posts 
    WHERE id = ?
");

$stmt->execute([$id]);

echo json_encode(["msg" => "deleted"]);
?>
