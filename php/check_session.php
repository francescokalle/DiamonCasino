<?php
session_start();

$response = [];

if (isset($_SESSION['username'])) {
    // Supponendo che salvi anche il numero di fish in $_SESSION
    $response['loggedIn'] = true;
    $response['username'] = $_SESSION['username'];
    $response['fish'] = $_SESSION['fish']; // <-- assicurati che esista
} else {
    $response['loggedIn'] = false;
}

header('Content-Type: application/json');
echo json_encode($response);
?>
