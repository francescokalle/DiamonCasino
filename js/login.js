document.addEventListener('DOMContentLoaded', () => {
    const usernameInput = document.querySelector('input[placeholder="Username"]');
    const passwordInput = document.querySelector('input[placeholder="Password"]');
    const registerBtn = document.getElementById('new-account-button');
    const loginBtn = document.getElementById('login-button');
    const form = document.querySelector('.login-form');

    let confirmPasswordInput = null;

    // Controlla se l'utente esiste
    const checkUserExists = async (username) => {
        const response = await fetch('php/check_user.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: `username=${encodeURIComponent(username)}`
        });
        return await response.json();
    };

    // Registra un nuovo utente
    const registerUser = async (username, password) => {
        const userExists = await checkUserExists(username);
        
        if (userExists.exists) {
            alert('Questo username è già registrato. Prova con uno diverso.');
            return;
        }

        const response = await fetch('php/register_user.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
        });
        const result = await response.json();
        if (result.success) {
            alert('Registrazione avvenuta con successo!');
            window.location.reload(); // Puoi anche reindirizzare
        } else {
            alert(result.error);
        }
    };

    // Login effettivo
    const loginUser = async (username, password) => {
        const response = await fetch('php/login_user.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
        });

        const result = await response.json();

        if (result.success) {
            alert(`Benvenuto, ${result.username}! Hai ${result.fish} fish.`);
            // Reindirizza a una pagina protetta (o aggiorna UI)
            window.location.href = 'index.html';  // Cambia se vuoi usare altra pagina
        } else {
            alert(result.error || 'Login fallito.');
        }
    };

    // Click su "Registrati"
    registerBtn.addEventListener('click', async () => {
        const username = usernameInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput ? confirmPasswordInput.value : '';

        if (!username || !password || !confirmPassword) {
            alert('Compila tutti i campi.');
            return;
        }

        if (password !== confirmPassword) {
            alert('Le password non coincidono.');
            return;
        }

        await registerUser(username, password); // Aggiungi controllo prima di registrare
    });

    // Click su "Accedi"
    loginBtn.addEventListener('click', async (e) => {
        e.preventDefault();  // Previene submit di default
        const username = usernameInput.value.trim();
        const password = passwordInput.value;

        if (!username || !password) {
            alert('Inserisci username e password.');
            return;
        }

        await loginUser(username, password);
    });

    // Monitoraggio dell'input username
    usernameInput.addEventListener('input', async () => {
        const username = usernameInput.value.trim();

        if (username.length > 2) {
            const result = await checkUserExists(username);
            if (result.exists) {
                showLoginUI();
            } else {
                showRegisterUI();
            }
        } else {
            hideAllUI();
        }
    });

    // UI: solo login
    const showLoginUI = () => {
        registerBtn.style.display = 'none';
        loginBtn.style.display = 'inline-block';

        if (confirmPasswordInput) {
            confirmPasswordInput.remove();
            confirmPasswordInput = null;
        }
    };

    // UI: solo registrazione
    const showRegisterUI = () => {
        registerBtn.style.display = 'inline-block';
        loginBtn.style.display = 'none';

        if (!confirmPasswordInput) {
            confirmPasswordInput = document.createElement('input');
            confirmPasswordInput.setAttribute('type', 'password');
            confirmPasswordInput.setAttribute('placeholder', 'Conferma Password');
            confirmPasswordInput.setAttribute('name', 'confirm_password');
            confirmPasswordInput.required = true;
            confirmPasswordInput.style.transition = 'all 0.3s ease';
            form.insertBefore(confirmPasswordInput, document.getElementById('login-actions'));
        }
    };

    // Nasconde tutto
    const hideAllUI = () => {
        registerBtn.style.display = 'none';
        loginBtn.style.display = 'none';
        if (confirmPasswordInput) {
            confirmPasswordInput.remove();
            confirmPasswordInput = null;
        }
    };

    // Nasconde i bottoni all'inizio
    hideAllUI();
});
