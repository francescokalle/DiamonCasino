// Carica i dati dell'utente al caricamento della pagina
document.addEventListener('DOMContentLoaded', () => {
    fetch('php/check_session.php')
        .then(response => response.json())
        .then(data => {
            if (data.loggedIn) {
                // Aggiorna il saldo fish
                document.getElementById('user-fish').textContent = data.fish;
            } else {
                // Se non loggato, reindirizza al login
                window.location.href = 'login.html';
            }
        });

    // Gestione cambio password
    const passwordForm = document.getElementById('change-password-form');
    if (passwordForm) {
        passwordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const oldPassword = passwordForm.querySelector('input[placeholder="Vecchia Password"]').value;
            const newPassword = passwordForm.querySelector('input[placeholder="Nuova Password"]').value;
            const confirmPassword = passwordForm.querySelector('input[placeholder="Conferma Nuova Password"]').value;

            try {
                const response = await fetch('php/change_password.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        oldPassword,
                        newPassword,
                        confirmPassword
                    })
                });

                const result = await response.json();

                if (result.success) {
                    alert('Password cambiata con successo!');
                    passwordForm.reset();
                } else {
                    alert(`Errore: ${result.error}`);
                }
            } catch (error) {
                console.error('Errore:', error);
                alert('Si è verificato un errore durante il cambio password');
            }
        });
    }

    // Animazione per gli input
    const inputs = document.querySelectorAll('.setting-item input');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.style.borderColor = '#7d05b1';
            input.style.boxShadow = '0 0 5px rgba(125, 5, 177, 0.5)';
        });

        input.addEventListener('blur', () => {
            input.style.borderColor = '#7d05b1';
            input.style.boxShadow = 'none';
        });
    });
});