<?php
session_start();
header("Content-Type: application/json");
require "config.php";

// 🔥 vérifier login
if (!isset($_SESSION['user_id'])) {
    echo json_encode(["msg" => "not logged in"]);
    exit;
}

$user_id = $_SESSION['user_id'];

// 🔥 récupération JSON OU POST normal
$item_type = $_POST['itemType'] ?? null;
$category = $_POST['category'] ?? null;
$date = $_POST['date'] ?? null;
$location = $_POST['location'] ?? null;
$description = $_POST['description'] ?? null;
$status = $_POST['status'] ?? 'lost';

// 🔥 image upload

// 📸 upload photo OPTIONNEL
$photo_path = NULL;

if (isset($_FILES['photo']) && $_FILES['photo']['error'] === 0) {

    $photo_name = $_FILES['photo']['name'];
    $photo_tmp = $_FILES['photo']['tmp_name'];

    $upload_dir = "uploads/";
    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0777, true);
    }

    $photo_path = $upload_dir . time() . "_" . basename($photo_name);
    move_uploaded_file($photo_tmp, $photo_path);
}

// 🔥 INSERT dans TA table posts
$stmt = $conn->prepare("
    INSERT INTO posts 
    (user_id, title, description, date, location, category, status, image)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
");

$stmt->execute([
    $user_id,
    $item_type,      // title
    $description,
    $date,
    $location,
    $category,
    $status,         // lost / found
    $photo_path
]);

echo json_encode(["msg" => "Post created successfully"]);
?>
