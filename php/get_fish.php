<?php
session_start();

header('Content-Type: application/json');

if (!isset($_SESSION['username'])) {
    echo json_encode(['success' => false, 'error' => 'Utente non autenticato']);
    exit;
}

try {
    $db = new PDO('sqlite:users.db');
    $username = $_SESSION['username'];

    $stmt = $db->prepare("SELECT fish FROM users WHERE username = :username");
    $stmt->bindParam(':username', $username);
    $stmt->execute();

    $fish = $stmt->fetchColumn();

    echo json_encode(['success' => true, 'fish' => (int)$fish]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
