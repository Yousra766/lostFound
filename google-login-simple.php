<?php
session_start();
require "config.php";

$data = json_decode(file_get_contents("php://input"), true);

$email = $data['email'];
$username = $data['username'];

// vérifier si user existe par email (IMPORTANT)
$stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch();

if(!$user){

    $stmt = $conn->prepare("
        INSERT INTO users (username, email, password, role) 
        VALUES (?, ?, '', 'user')
    ");
    $stmt->execute([$username, $email]);

    $user_id = $conn->lastInsertId();

} else {
    $user_id = $user['id'];
}

$_SESSION['user_id'] = $user_id;
$_SESSION['username'] = $username;
$_SESSION['role'] = "user";

echo json_encode([
    "user_id" => $user_id,
    "username" => $username,
    "role" => "user"
]);
?>