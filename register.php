<?php
header('Content-Type: application/json');
require __DIR__ . '/config.php';

$data = json_decode(file_get_contents("php://input"));

$username = $data->username ?? '';
$email = $data->email ?? '';
$phone = $data->phone ?? '';
$password = $data->password ?? '';
$confirmPassword = $data->confirmPassword ?? '';

if (!$username || !$email || !$phone || !$password || !$confirmPassword) {
    echo json_encode(['msg' => 'All fields are required']);
    exit;
}

if ($password !== $confirmPassword) {
    echo json_encode(['msg' => 'Passwords do not match']);
    exit;
}

try {
    // vérifier si user existe déjà
    $stmt = $conn->prepare("SELECT * FROM users WHERE username = :username OR email = :email");
    $stmt->execute([
        'username' => $username,
        'email' => $email
    ]);

    if ($stmt->rowCount() > 0) {
        echo json_encode(['msg' => 'This user already exists']);
        exit;
    }

    // hash password
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // insert user
    $stmt = $conn->prepare("
        INSERT INTO users (username, email, phone, password, role)
        VALUES (:username, :email, :phone, :password, :role)
    ");

    $stmt->execute([
        'username' => $username,
        'email' => $email,
        'phone' => $phone,
        'password' => $hashedPassword,
        'role' => 'user'
    ]);

    echo json_encode(['msg' => 'User created successfully']);

} catch(PDOException $e) {
    echo json_encode(['msg' => 'Server error: ' . $e->getMessage()]);
}
?>
