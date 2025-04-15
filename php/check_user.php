<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['username'])) {
    $username = trim($_POST['username']);
    $db = new PDO('sqlite:users.db'); // Aggiungi il percorso corretto al tuo DB

    $stmt = $db->prepare("SELECT COUNT(*) FROM users WHERE username = :username");
    $stmt->bindParam(':username', $username);
    $stmt->execute();
    $exists = $stmt->fetchColumn() > 0;

    echo json_encode(['exists' => $exists]);
    exit;
}
?>