<?php
// set_fish.php
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_SESSION['username']) && isset($_POST['fish'])) {
    $db = new PDO('sqlite:users.db');
    $username = $_SESSION['username'];
    $fish = intval($_POST['fish']);

    $stmt = $db->prepare("UPDATE users SET fish = :fish WHERE username = :username");
    $stmt->bindParam(':fish', $fish);
    $stmt->bindParam(':username', $username);
    $result = $stmt->execute();

    if ($result) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Errore durante l\'aggiornamento.']);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Non loggato o valore fish mancante.']);
}
?>
