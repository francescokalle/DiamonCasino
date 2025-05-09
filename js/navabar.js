


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

    // navbar.js - Versione semplificata con redirect diretto ad account.htmls
    async function getFish() {
      const response = await fetch('/php/get_fish.php', {
          method: 'POST'
      });
      const data = await response.json();
      if (data.success) {
          return data.fish; // ritorna direttamente il numero
      } else {
          throw new Error(data.error || 'Errore sconosciuto.');
      }
    }

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
        .then(async data => {
          if (data.loggedIn) {
            // Utente loggato - cambia testo e comportamento
            buttonUser.textContent = data.username;
            buttonUser.classList.add('logged-in');

            // 🔥 Prendi il numero di fish aggiornato usando getFish()
            let fish = 0;
            try {
              fish = await getFish();
            } catch (error) {
              console.error('Errore nel caricamento delle fish:', error.message);
            }

            // Aggiungi display fish
            const fishDisplay = document.createElement('span');
            fishDisplay.innerHTML = `${fish} 
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 477.778 477.778" width="30" height="30" style="fill: white;">
                <g>
                  <path d="M461.4,152.432c-9.782-25.141-23.593-48.221-40.81-68.392C384.958,42.264,335.206,13.08,278.704,3.585
                  C265.732,1.4,252.482,0,238.889,0c-13.594,0-26.845,1.4-39.815,3.585C142.571,13.08,92.834,42.256,57.187,84.024
                  c-17.202,20.18-31.013,43.252-40.794,68.392C5.94,179.261,0,208.351,0,238.889c0,28.065,5.085,54.878,13.981,79.894
                  c9.051,25.445,22.131,48.945,38.726,69.592c35.881,44.636,87.452,75.919,146.367,85.818c12.97,2.185,26.221,3.585,39.815,3.585
                  c13.593,0,26.843-1.4,39.815-3.585c58.913-9.9,110.486-41.183,146.366-85.812c16.595-20.645,29.675-44.145,38.725-69.59
                  c8.896-25.016,13.983-51.837,13.983-79.902C477.778,208.359,471.836,179.269,461.4,152.432z M433.375,168.6L391.6,192.713
                  c-7.915-26.128-22.365-49.41-41.447-68.012l42.162-24.34C410.123,120.067,424.152,143.155,433.375,168.6z M366.623,238.889
                  c0,70.431-57.297,127.734-127.734,127.734c-70.439,0-127.735-57.303-127.735-127.734c0-70.429,57.297-127.734,127.735-127.734
                  C309.326,111.155,366.623,168.46,366.623,238.889z M238.889,31.852c13.623,0,26.921,1.408,39.815,3.927v48.757
                  c-12.754-3.297-26.052-5.233-39.815-5.233c-13.765,0-27.063,1.937-39.815,5.233V35.779
                  C211.966,33.26,225.264,31.852,238.889,31.852z M85.476,100.354l42.164,24.347c-19.082,18.594-33.546,41.876-41.463,68.004
                  l-41.775-24.113C53.64,143.147,67.669,120.059,85.476,100.354z M41.992,302.609l42.396-24.472
                  c6.75,26.556,20.11,50.438,38.321,69.824l-41.992,24.238C63.626,351.942,50.359,328.388,41.992,302.609z M238.889,445.926
                  c-13.625,0-26.923-1.408-39.815-3.927v-48.757c12.752,3.298,26.05,5.233,39.815,5.233c13.763,0,27.061-1.935,39.815-5.233v48.757
                  C265.81,444.518,252.512,445.926,238.889,445.926z M397.043,372.199l-41.976-24.238c18.211-19.379,31.572-43.268,38.321-69.824
                  l42.396,24.48C427.417,328.388,414.151,351.942,397.043,372.199z"/>
                  <path d="M252.388,221.533c-20.312-7.644-28.664-12.66-28.664-20.546c0-6.687,5.009-13.374,20.545-13.374
                  c8.958,0,16.238,1.486,22.024,3.289c3.281,1.019,6.842,0.639,9.86-1.042c3.002-1.672,5.179-4.51,6.034-7.847l0.218-0.823
                  c1.943-7.613-2.629-15.375-10.25-17.342c-5.848-1.516-12.8-2.62-21.197-2.994v-8.969c0-6.096-4.518-11.429-10.587-11.997
                  c-6.96-0.651-12.821,4.817-12.821,11.651v10.987c-25.567,5.015-40.374,21.501-40.374,42.52c0,23.174,17.434,35.118,43.003,43.718
                  c17.669,5.972,25.319,11.704,25.319,20.778c0,9.557-9.315,14.815-22.94,14.815c-9.751,0-18.944-1.983-26.921-4.813
                  c-3.328-1.19-7.015-0.903-10.142,0.761c-3.125,1.664-5.412,4.556-6.283,7.995l-0.108,0.405
                  c-2.084,8.141,2.612,16.469,10.653,18.896c7.885,2.371,17.156,4.043,26.595,4.464v10.669c0,6.464,5.24,11.704,11.704,11.704l0,0
                  c6.464,0,11.704-5.24,11.704-11.704v-12.341c27.466-4.775,42.521-22.933,42.521-44.193
                  C292.281,244.707,280.819,231.565,252.388,221.533z"/>
                </g>
              </svg>`;

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
    });
  })
  .catch(error => {
    console.error('Errore durante il caricamento della navbar:', error);
  });