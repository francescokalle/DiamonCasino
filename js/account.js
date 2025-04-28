// Carica i dati dell'utente al caricamento della pagina
document.addEventListener('DOMContentLoaded', () => {
    var resetFishButton = document.getElementById("reset-fish");

    async function setFish(fish) {
        await fetch('/php/set_fish.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'fish=' + encodeURIComponent(fish)
        });
    }

    // Gestione reset fish
    if (resetFishButton) {
        resetFishButton.addEventListener('click', async () => {
            try {
                await setFish(500); // Chiamata asincrona per impostare il fish a 500
                window.location.reload(); // Ricarica la pagina dopo il completamento
            } catch (error) {
                console.error('Errore durante il reset del fish:', error);
                alert('Si è verificato un errore durante il reset del fish');
            }
        });
    }

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
});