<?php
$db = new PDO('sqlite:users.db');

$db->exec("CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
    -- Aggiungi facilmente altri campi qui, es:
    -- email TEXT,
    -- created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)");

echo "Database e tabella utenti creati!";
?>
