<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

session_start();
header("Access-Control-Allow-Origin: http://localhost");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

require "config.php";

if(!isset($_SESSION['user_id'])){
    echo json_encode([
        "error" => "not logged in"
    ]);
    exit;
}

$user_id = $_SESSION['user_id'];

$stmt = $conn->prepare("SELECT username,email,phone,avatar FROM users WHERE id=?");
$stmt->execute([$user_id]);

echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));
