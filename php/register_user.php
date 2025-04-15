<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['username']) && isset($_POST['password'])) {
    // Connessione al database SQLite
    $db = new PDO('sqlite:users.db'); // Aggiungi il percorso corretto al tuo DB
    $username = trim($_POST['username']);
    $password = password_hash(trim($_POST['password']), PASSWORD_DEFAULT);  // Proteggi la password con hash

    // Controlla se l'utente esiste già
    $stmt = $db->prepare("SELECT COUNT(*) FROM users WHERE username = :username");
    $stmt->bindParam(':username', $username);
    $stmt->execute();
    $exists = $stmt->fetchColumn() > 0;

    if ($exists) {
        // Se l'utente esiste, restituisce un errore
        echo json_encode(['success' => false, 'error' => 'Username già esistente.']);
    } else {
        // Se non esiste, inserisce l'utente nel database
        $stmt = $db->prepare("INSERT INTO users (username, password, fish) VALUES (:username, :password, 0)");
        $stmt->bindParam(':username', $username);
        $stmt->bindParam(':password', $password);
        $stmt->execute();
        echo json_encode(['success' => true]);
    }
}
?>
