document.addEventListener('DOMContentLoaded', function() {

    // Variabili di gioco
    let saldo = 1000;
    let puntataCorrente = 10;
    let inRotazione = false;
    
    // Simboli per le slot
    const simboli = ['🍒', '🍋', '💣','🍉', '7️⃣', '🔔', '💎'];
    
    const simboloVincente = '💎'; // Diamante
    
    // Elementi 
    const slot1 = document.getElementById('slot1');
    const slot2 = document.getElementById('slot2');
    const slot3 = document.getElementById('slot3');

    const pulsanteGira = document.getElementById('pulsanteGira');
    const displaySaldo = document.getElementById('saldo');
    const displayPuntata = document.getElementById('puntataCorrente');
    const aumentaPuntata = document.getElementById('aumentaPuntata');
    const diminuisciPuntata = document.getElementById('diminuisciPuntata');
    const messaggioVittoria = document.getElementById('messaggioVittoria');
    
    // Inizializza le slot chiamando la funzione per generare un simbolo    
    function inizializzaSlot() {
        slot1.innerHTML = `<div class="simbolo">${simboloCasuale()}</div>`;
        slot2.innerHTML = `<div class="simbolo">${simboloCasuale()}</div>`;
        slot3.innerHTML = `<div class="simbolo">${simboloCasuale()}</div>`;
    }
    
    // Ottieni un simbolo casuale
    function simboloCasuale() {
        return simboli[Math.floor(Math.random() * simboli.length)];
    }
    
    // Aggiorna il display del saldo
    function aggiornaSaldo() {
        displaySaldo.textContent = saldo;
    }
    
    // Aggiorna il display della puntata
    function aggiornaPuntata() {
        displayPuntata.textContent = puntataCorrente;
    }
    
    // Controlla le vincite con i diamanti
    function controllaVincita(s1, s2, s3) {
        const diamanti = [s1, s2, s3].filter(simbolo => simbolo === simboloVincente).length;
        
        if (diamanti > 0) {
            return diamanti;
        }
        
        // Vincita normale se tutti e 3 sono uguali
        if (s1 === s2 && s2 === s3) {
            return 3; // Considerato come 3 diamanti
        }
        
        return 0;
    }
    
    // Calcola la vincita
    function calcolaVincita(numeroDiamanti) {
        if (numeroDiamanti === 1) {
            return puntataCorrente; // 1x la puntata per 1 diamante
        } else if (numeroDiamanti === 2) {
            return puntataCorrente * 2; // 2x la puntata per 2 diamanti
        } else if (numeroDiamanti === 3) {
            return puntataCorrente * 4; // 4x la puntata per 3 diamanti
        }
        return 0;
    }
    
    // Mostra messaggio di vittoria
    function mostraMessaggioVittoria(importo) {
        
        attivaEffettiVittoria();

        messaggioVittoria.textContent = `Hai Vinto €${importo}!`;
        messaggioVittoria.classList.add('mostra');
        
        setTimeout(() => {
            messaggioVittoria.classList.remove('mostra');
        }, 3000);
    }
    
    // Gira le slot
    function giraSlot() {
        if (inRotazione || saldo < puntataCorrente) return;
    
        inRotazione = true;
        pulsanteGira.disabled = true;
        saldo -= puntataCorrente;
        aggiornaSaldo();
    
        slot1.classList.add('girando');
        slot2.classList.add('girando');
        slot3.classList.add('girando');
    
        let risultato1, risultato2, risultato3;
    
        // Funzione per animare singola slot
        function animaSlot(slotElement, callback) {
            let count = 0;
            const maxCicli = 10;
            const interval = setInterval(() => {
                slotElement.innerHTML = `<div class="simbolo">${simboloCasuale()}</div>`;
                count++;
                if (count >= maxCicli) {
                    clearInterval(interval);
                    const risultatoFinale = simboloCasuale();
                    slotElement.innerHTML = `<div class="simbolo">${risultatoFinale}</div>`;
                    callback(risultatoFinale);
                }
            }, 100); // cambia ogni 100ms per un totale di 1s
        }
    
        // Gira e ferma le slot in sequenza
        animaSlot(slot1, (res1) => {
            slot1.classList.remove('girando');
            risultato1 = res1;
    
            setTimeout(() => {
                animaSlot(slot2, (res2) => {
                    slot2.classList.remove('girando');
                    risultato2 = res2;
    
                    setTimeout(() => {
                        animaSlot(slot3, (res3) => {
                            slot3.classList.remove('girando');
                            risultato3 = res3;
    
                            // Fine animazione, controlla vincita
                            const diamantiTrovati = controllaVincita(risultato1, risultato2, risultato3);
                            if (diamantiTrovati > 0) {
                                const vincita = calcolaVincita(diamantiTrovati);
                                saldo += vincita;
                                aggiornaSaldo();
                                mostraMessaggioVittoria(vincita);
                            }
    
                            inRotazione = false;
                            pulsanteGira.disabled = false;
                        });
                    }, 1000); // aspetta 1 secondo prima di fermare la terza
                });
            }, 1000); // aspetta 1 secondo prima di fermare la seconda
        });
    }
    

    
    // Aumenta la puntata
    function aumentaLaPuntata() {
        if (puntataCorrente < 100) {
            puntataCorrente += 10;
            aggiornaPuntata();
        }
    }
    
    // Diminuisci la puntata
    function diminuisciLaPuntata() {
        if (puntataCorrente > 10) {
            puntataCorrente -= 10;
            aggiornaPuntata();
        }
    }
    function attivaEffettiVittoria() {
        const template = document.getElementById('template-effetti');
        const effetti = template.content.cloneNode(true);
        
        const container = effetti.querySelector('.effetto-container');
        document.body.appendChild(container);
        
        // Genera posizioni casuali
        creaFuochi(container);
        creaBottiglie(container);
        creaSoldi(container);
        
        setTimeout(() => container.remove(), 2000);
    }
    
    function creaFuochi(container) {
        for(let i = 0; i < 20; i++) {
            const fuoco = container.querySelector('.fuochi-artificio').cloneNode();
            fuoco.style.left = `${Math.random() * 100}%`;
            fuoco.style.top = `${Math.random() * 100}%`;
            container.appendChild(fuoco);
        }
    }
    
    function creaBottiglie(container) {
        for(let i = 0; i < 5; i++) {
            const bottiglia = container.querySelector('.bottiglie-stappano').cloneNode(true);
            bottiglia.style.left = `${Math.random() * 100}%`;
            bottiglia.style.fontSize = `${20 + Math.random() * 20}px`;
            container.appendChild(bottiglia);
        }
    }
    
    function creaSoldi(container) {
        for(let i = 0; i < 10; i++) {
            const soldi = container.querySelector('.soldi-volanti').cloneNode(true);
            soldi.style.left = `${Math.random() * 100}%`;
            soldi.style.animationDelay = `${Math.random() * 1}s`;
            container.appendChild(soldi);
        }
    }
    
    // Event listeners
    pulsanteGira.addEventListener('click', giraSlot);
    aumentaPuntata.addEventListener('click', aumentaLaPuntata);
    diminuisciPuntata.addEventListener('click', diminuisciLaPuntata);
    
    // Inizializza il gioco
    inizializzaSlot();
    aggiornaSaldo();
    aggiornaPuntata();
});