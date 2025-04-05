fetch('../prefab/navbar.html')
  .then(response => response.text())
  .then(data => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(data, 'text/html');
    const nuovoContenuto = doc.body.firstElementChild;
    const contenitore = document.getElementById('navbar');

    contenitore.replaceWith(nuovoContenuto);

    // Bottoni
    const buttonHome = document.getElementById('navbar-button-home');
    const buttonGames = document.getElementById('navbar-button-games');
    const buttonMarket = document.getElementById('navbar-button-market');

    // Funzione per impostare il bottone attivo in base all'URL
    function setActiveButton() {
      const path = window.location.pathname;

      if (path.includes('index.html')) {
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
  })
  .catch(error => {
    console.error('Errore durante il caricamento della navbar:', error);
  });
