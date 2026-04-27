<?php
session_start();
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Origin: http://localhost");
header('Content-Type: application/json');

require __DIR__ . '/config.php';

$data = json_decode(file_get_contents("php://input"));

$username = $data->username ?? '';
$password = $data->password ?? '';

if (!$username || !$password) {
    echo json_encode(['msg' => 'Tous les champs sont requis']);
    exit;
}

try {
    $stmt = $conn->prepare("SELECT * FROM users WHERE username = :username");
    $stmt->execute(['username' => $username]);

    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        echo json_encode(['msg' => 'Utilisateur introuvable']);
        exit;
    }

    if (password_verify($password, $user['password'])) {

        // SESSION
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['username'];
        $_SESSION['role'] = $user['role'];

        // CLEAN ROLE (important pour JS)
        $role = strtolower(trim($user['role']));

        echo json_encode([
            'msg' => 'Login successful',
            'user_id' => $user['id'],
            'username' => $user['username'],
            'role' => $role
        ]);

    } else {
        echo json_encode(['msg' => 'Wrong password']);
    }

} catch (PDOException $e) {
    echo json_encode(['msg' => 'Server error']);
}
?>
