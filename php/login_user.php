<?php
session_start();
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['username']) && isset($_POST['password'])) {
    $username = trim($_POST['username']);
    $password = trim($_POST['password']);

    try {
        // Connessione al database SQLite
        $db = new PDO('sqlite:users.db');
        $stmt = $db->prepare("SELECT * FROM users WHERE username = :username LIMIT 1");
        $stmt->bindParam(':username', $username);
        $stmt->execute();

        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && password_verify($password, $user['password'])) {
            // Login riuscito: crea sessione con i dati dell’utente
            $_SESSION['username'] = $user['username'];
            $_SESSION['fish'] = $user['fish'];  // Puoi aggiungere altri campi in futuro

            echo json_encode([
                'success' => true,
                'username' => $user['username'],
                'fish' => $user['fish']
            ]);
        } else {
            echo json_encode(['success' => false, 'error' => 'Credenziali non valide.']);
        }
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'error' => 'Errore nel login: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Richiesta non valida.']);
}
