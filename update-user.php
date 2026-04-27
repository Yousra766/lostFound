<?php
session_start();
header("Content-Type: application/json");

require "config.php";

if(!isset($_SESSION['user_id'])){
    echo json_encode(["msg"=>"not logged in"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"));

$user_id = $_SESSION['user_id'];

$avatar = isset($data->avatar) ? $data->avatar : null;

$stmt = $conn->prepare("
    UPDATE users 
    SET username=?, email=?, phone=?, avatar=COALESCE(?, avatar)
    WHERE id=?
");

$stmt->execute([
    $data->name,
    $data->email,
    $data->phone,
    $avatar,
    $user_id
]);

echo json_encode(["msg" => "updated"]);
?>
