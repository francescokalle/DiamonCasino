<?php
// get_fish.php
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_SESSION['username'])) {
    $db = new PDO('sqlite:users.db');
    $username = $_SESSION['username'];

    $stmt = $db->prepare("SELECT fish FROM users WHERE username = :username");
    $stmt->bindParam(':username', $username);
    $stmt->execute();
    $fish = $stmt->fetchColumn();

    if ($fish !== false) {
        echo json_encode(['success' => true, 'fish' => $fish]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Utente non trovato.']);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Non loggato.']);
}
?>