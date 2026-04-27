<?php
session_start();
header("Access-Control-Allow-Origin: http://localhost");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

if(!isset($_SESSION['user_id'])){
    echo json_encode(["authorized" => false]);
    exit;
}

if($_SESSION['role'] !== "admin"){
    echo json_encode(["authorized" => false]);
    exit;
}

echo json_encode([
    "authorized" => true,
    "username" => $_SESSION['username']
]);