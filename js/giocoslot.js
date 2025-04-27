document.addEventListener('DOMContentLoaded', function() {
    // Variabili di gioco
    let puntataCorrente = 10;
    let inRotazione = false;
    
    const simboli = ['🍒', '🍋', '💣','🍉', '7️⃣', '🔔', '💎'];
    const simboloVincente = '💎';
    
    const slot1 = document.getElementById('slot1');
    const slot2 = document.getElementById('slot2');
    const slot3 = document.getElementById('slot3');
    const pulsanteGira = document.getElementById('pulsanteGira');
    const displaySaldo = document.getElementById('saldo');
    const displayPuntata = document.getElementById('puntataCorrente');
    const aumentaPuntata = document.getElementById('aumentaPuntata');
    const diminuisciPuntata = document.getElementById('diminuisciPuntata');
    const messaggioVittoria = document.getElementById('messaggioVittoria');

    async function getFish() {
        const response = await fetch('/php/get_fish.php', { method: 'POST' });
        const data = await response.json();
        if (data.success) {
            return data.fish;
        } else {
            throw new Error(data.error || 'Errore sconosciuto.');
        }
    }

    async function setFish(fish) {
        await fetch('/php/set_fish.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'fish=' + encodeURIComponent(fish)
        });
    }

    async function aggiornaSaldo() {
        try {
            const fish = await getFish();
            displaySaldo.textContent = fish;
        } catch (error) {
            console.error('Errore nel recupero delle fish:', error.message);
        }
    }

    function inizializzaSlot() {
        slot1.innerHTML = `<div class="simbolo">${simboloCasuale()}</div>`;
        slot2.innerHTML = `<div class="simbolo">${simboloCasuale()}</div>`;
        slot3.innerHTML = `<div class="simbolo">${simboloCasuale()}</div>`;
    }
    
    function simboloCasuale() {
        return simboli[Math.floor(Math.random() * simboli.length)];
    }

    function aggiornaPuntata() {
        displayPuntata.textContent = puntataCorrente;
    }

    function controllaVincita(s1, s2, s3) {
        const diamanti = [s1, s2, s3].filter(simbolo => simbolo === simboloVincente).length;
        if (diamanti > 0) return diamanti;
        if (s1 === s2 && s2 === s3) return 3;
        return 0;
    }

    function calcolaVincita(numeroDiamanti) {
        if (numeroDiamanti === 1) return puntataCorrente;
        if (numeroDiamanti === 2) return puntataCorrente * 2;
        if (numeroDiamanti === 3) return puntataCorrente * 4;
        return 0;
    }

    function mostraMessaggioVittoria(importo) {
        attivaEffettiVittoria();
        messaggioVittoria.textContent = `Hai Vinto €${importo}!`;
        messaggioVittoria.classList.add('mostra');
        setTimeout(() => {
            messaggioVittoria.classList.remove('mostra');
        }, 3000);
    }

    async function giraSlot() {
        const saldoAttuale = await getFish();
        if (inRotazione || saldoAttuale < puntataCorrente) return;
    
        inRotazione = true;
        pulsanteGira.disabled = true;
        
        await setFish(saldoAttuale - puntataCorrente);
        aggiornaSaldo();
    
        slot1.classList.add('girando');
        slot2.classList.add('girando');
        slot3.classList.add('girando');
    
        let risultato1, risultato2, risultato3;

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
            }, 100);
        }

        animaSlot(slot1, (res1) => {
            slot1.classList.remove('girando');
            risultato1 = res1;
            setTimeout(() => {
                animaSlot(slot2, (res2) => {
                    slot2.classList.remove('girando');
                    risultato2 = res2;
                    setTimeout(() => {
                        animaSlot(slot3, async (res3) => {
                            slot3.classList.remove('girando');
                            risultato3 = res3;

                            const diamantiTrovati = controllaVincita(risultato1, risultato2, risultato3);
                            if (diamantiTrovati > 0) {
                                const vincita = calcolaVincita(diamantiTrovati);
                                const saldoAggiornato = await getFish();
                                await setFish(saldoAggiornato + vincita);
                                aggiornaSaldo();
                                mostraMessaggioVittoria(vincita);
                            }

                            inRotazione = false;
                            pulsanteGira.disabled = false;
                        });
                    }, 1000);
                });
            }, 1000);
        });
    }

    function aumentaLaPuntata() {
        if (puntataCorrente < 100) {
            puntataCorrente += 10;
            aggiornaPuntata();
        }
    }

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

    pulsanteGira.addEventListener('click', giraSlot);
    aumentaPuntata.addEventListener('click', aumentaLaPuntata);
    diminuisciPuntata.addEventListener('click', diminuisciLaPuntata);

    inizializzaSlot();
    aggiornaSaldo();
    aggiornaPuntata();
});
