// navbar.js - Versione semplificata con redirect diretto ad account.html

fetch('../prefab/navbar.html')
  .then(response => response.text())
  .then(data => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(data, 'text/html');
    const nuovoContenuto = doc.body.firstElementChild;
    const contenitore = document.getElementById('navbar');

    contenitore.replaceWith(nuovoContenuto);

    const navbarButtonsReady = () => new Promise(resolve => {
      requestAnimationFrame(() => {
        resolve();
      });
    });

    navbarButtonsReady().then(() => {
      const buttonHome = document.getElementById('navbar-button-home');
      const buttonGames = document.getElementById('navbar-button-games');
      const buttonMarket = document.getElementById('navbar-button-market');
      const buttonUser = document.getElementById('navbar-button-user');

      if (!buttonUser) {
        console.error('⚠️ buttonUser non trovato nel DOM!');
        return;
      }

      // 🔐 Controlla sessione attiva
      fetch('php/check_session.php')
        .then(res => res.json())
        .then(data => {
          if (data.loggedIn) {
            // Utente loggato - cambia testo e comportamento
            buttonUser.textContent = data.username;
            buttonUser.classList.add('logged-in');

            // Aggiungi display fish
            const fishDisplay = document.createElement('span');
            fishDisplay.textContent = `${data.fish} fish`;
            fishDisplay.classList.add('fish-info');
            buttonUser.parentElement.insertBefore(fishDisplay, buttonUser);

            // Reindirizza a account.html al click
            buttonUser.addEventListener('click', () => {
              window.location.href = 'account.html';
            });
          } else {
            // Utente non loggato - comportamento normale
            buttonUser.addEventListener('click', () => {
              window.location.href = 'login.html';
            });
          }
        });

      // Funzione per impostare il bottone attivo in base all'URL
      function setActiveButton() {
        const path = window.location.pathname;
        const currentPage = path.split('/').pop();

        if (path.includes('index.html') || currentPage === '') {
          buttonHome.classList.add('active');
          buttonGames.classList.remove('active');
          buttonMarket.classList.remove('active');
        } else if (path.includes('games.html')) {
          buttonHome.classList.remove('active');
          buttonGames.classList.add('active');
          buttonMarket.classList.remove('active');
        } else if (path.includes('market.html')) {
          buttonHome.classList.remove('active');
          buttonGames.classList.remove('active');
          buttonMarket.classList.add('active');
        }
      }

      // Applica il bottone attivo quando la pagina è caricata
      setActiveButton();

      // Funzione per transizione uscita barra bianca
      function attivaBottoneAttuale(nome) {
        const current = document.querySelector('.navbar-button.active');
        if (current) {
          current.classList.remove('active');
          current.classList.add('anim-exit');
          setTimeout(() => {
            current.classList.remove('anim-exit');
          }, 300);
        }
      }

      // Event listener per i bottoni
      buttonHome.addEventListener('click', () => {
        attivaBottoneAttuale('home');
        location.href = "../index.html";
      });

      buttonGames.addEventListener('click', () => {
        attivaBottoneAttuale('games');
        location.href = "../games.html";
      });

      buttonMarket.addEventListener('click', () => {
        attivaBottoneAttuale('market');
        location.href = "../market.html";
      });
    });
  })
  .catch(error => {
    console.error('Errore durante il caricamento della navbar:', error);
  });