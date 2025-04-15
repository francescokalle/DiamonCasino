<?php
$db = new PDO('sqlite:users.db'); // Assicurati che il percorso del DB sia corretto

$query = "SELECT username FROM users";
$stmt = $db->query($query);

$users = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo "<h3>Utenti registrati:</h3>";
echo "<ul>";
foreach ($users as $user) {
    echo "<li>" . htmlspecialchars($user['username']) . "</li>";
}
echo "</ul>";
?>
