<?php
session_start();

// Distrugge tutte le variabili di sessione
$_SESSION = array();

// Se si desidera distruggere completamente la sessione, cancella anche
// il cookie di sessione.
// Nota: questo distruggerà la sessione, non solo i dati della sessione!
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}

// Infine, distrugge la sessione
session_destroy();

// Reindirizza alla homepage o alla pagina di login
header("Location: ../index.html"); // Modifica il percorso se necessario
exit();
?>