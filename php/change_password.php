<?php
session_start();
header('Content-Type: application/json');

// Verifica che la richiesta sia POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'error' => 'Metodo non consentito']);
    exit;
}

// Verifica che l'utente sia loggato
if (!isset($_SESSION['username'])) {
    echo json_encode(['success' => false, 'error' => 'Utente non autenticato']);
    exit;
}

// Recupera i dati dalla richiesta
$data = json_decode(file_get_contents('php://input'), true);
$oldPassword = $data['oldPassword'] ?? '';
$newPassword = $data['newPassword'] ?? '';
$confirmPassword = $data['confirmPassword'] ?? '';

// Validazione
if (empty($oldPassword) || empty($newPassword) || empty($confirmPassword)) {
    echo json_encode(['success' => false, 'error' => 'Compila tutti i campi']);
    exit;
}

if ($newPassword !== $confirmPassword) {
    echo json_encode(['success' => false, 'error' => 'Le nuove password non coincidono']);
    exit;
}

if (strlen($newPassword) < 2) {
    echo json_encode(['success' => false, 'error' => 'La password deve contenere almeno 8 caratteri']);
    exit;
}

try {
    // Connessione al database
    $db = new PDO('sqlite:users.db');
    
    // Recupera l'utente corrente
    $stmt = $db->prepare("SELECT password FROM users WHERE username = :username");
    $stmt->bindParam(':username', $_SESSION['username']);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user || !password_verify($oldPassword, $user['password'])) {
        echo json_encode(['success' => false, 'error' => 'Password corrente non valida']);
        exit;
    }

    // Hash della nuova password
    $newPasswordHash = password_hash($newPassword, PASSWORD_DEFAULT);

    // Aggiorna la password
    $stmt = $db->prepare("UPDATE users SET password = :password WHERE username = :username");
    $stmt->bindParam(':password', $newPasswordHash);
    $stmt->bindParam(':username', $_SESSION['username']);
    $stmt->execute();

    echo json_encode(['success' => true, 'message' => 'Password cambiata con successo']);
    
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => 'Errore del server: ' . $e->getMessage()]);
}
?>