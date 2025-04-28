// Stato del gioco
const gameState = {
    deck: [],
    playerHand: [],
    dealerHand: [],
    gameOver: true,
    currentBet: 0,
    fish: 100
};

// Elementi del DOM
const elements = {
    fishCount: document.getElementById('fish-count'),
    dealerCards: document.getElementById('dealer-cards'),
    playerCards: document.getElementById('player-cards'),
    dealerScore: document.getElementById('dealer-score'),
    playerScore: document.getElementById('player-score'),
    betControls: document.getElementById('bet-controls'),
    gameControls: document.getElementById('game-controls'),
    hitBtn: document.getElementById('hit-btn'),
    standBtn: document.getElementById('stand-btn'),
    placeBet: document.getElementById('place-bet'),
    betAmount: document.getElementById('bet-amount'),
    newGameBtn: document.getElementById('new-game-btn'),
    gameMessage: document.getElementById('game-message')
};

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

// Inizializzazione del gioco
async function initGame() {
    try {
        gameState.fish = await getFish();
        updateUI();
        setupEventListeners();
    } catch (error) {
        console.error('Errore nel recupero delle fish:', error.message);
        showMessage('Errore nel caricamento del saldo', 'lose');
    }
}

// Configura gli event listeners
function setupEventListeners() {
    elements.placeBet.addEventListener('click', placeBetHandler);
    elements.hitBtn.addEventListener('click', hitHandler);
    elements.standBtn.addEventListener('click', standHandler);
    elements.newGameBtn.addEventListener('click', newGameHandler);
}

// Gestione della puntata
async function placeBetHandler() {
    const bet = parseInt(elements.betAmount.value);
    
    if (isNaN(bet)) {
        showMessage('Inserisci una puntata valida', 'lose');
        return;
    }

    if (bet < 1) {
        showMessage('La puntata minima è 1', 'lose');
        return;
    }

    try {
        const currentFish = await getFish();
        if (bet > currentFish) {
            showMessage('Non hai abbastanza fish', 'lose');
            return;
        }

        await startGame(bet);
    } catch (error) {
        console.error('Errore nella gestione della puntata:', error.message);
        showMessage('Errore durante la puntata', 'lose');
    }
}

// Avvia una nuova partita
async function startGame(bet) {
    gameState.currentBet = bet;
    gameState.gameOver = false;
    gameState.deck = createDeck();
    gameState.playerHand = [drawCard(), drawCard()];
    gameState.dealerHand = [drawCard(), drawCard()];

    // Sottrai la puntata
    gameState.fish -= bet;
    await setFish(gameState.fish);
    updateFishDisplay();

    // Mostra i controlli di gioco
    elements.betControls.style.display = 'none';
    elements.gameControls.style.display = 'flex';
    elements.newGameBtn.style.display = 'none';

    updateUI();
    checkBlackjack();
}

// Gestione del "Chiedi carta"
function hitHandler() {
    if (gameState.gameOver) return;

    gameState.playerHand.push(drawCard());
    updateUI();

    const playerScore = calculateScore(gameState.playerHand);
    if (playerScore > 21) {
        endGame('lose', 'Hai sballato! Hai perso.');
    }
}

// Gestione del "Stai"
function standHandler() {
    if (gameState.gameOver) return;
    dealerTurn();
}

// Nuova partita
async function newGameHandler() {
    await resetGame();
}

// Crea un mazzo di carte
function createDeck() {
    const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const deck = [];

    for (let suit of suits) {
        for (let value of values) {
            deck.push({ suit, value });
        }
    }

    return shuffleDeck(deck);
}

// Mescola il mazzo
function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}

// Pesca una carta
function drawCard() {
    return gameState.deck.pop();
}

// Aggiorna l'interfaccia utente
function updateUI() {
    updatePlayerUI();
    updateDealerUI();
    updateFishDisplay();
}

function updatePlayerUI() {
    elements.playerCards.innerHTML = '';
    gameState.playerHand.forEach(card => {
        elements.playerCards.appendChild(createCardElement(card));
    });
    elements.playerScore.textContent = calculateScore(gameState.playerHand);
}

function updateDealerUI() {
    elements.dealerCards.innerHTML = '';
    
    if (gameState.gameOver) {
        // Mostra tutte le carte del banco
        gameState.dealerHand.forEach(card => {
            elements.dealerCards.appendChild(createCardElement(card));
        });
        elements.dealerScore.textContent = calculateScore(gameState.dealerHand);
    } else {
        // Mostra solo la prima carta del banco
        elements.dealerCards.appendChild(createCardElement(gameState.dealerHand[0]));
        elements.dealerCards.appendChild(createCardElement(null, true));
        elements.dealerScore.textContent = calculateScore([gameState.dealerHand[0]]);
    }
}

function updateFishDisplay() {
    elements.fishCount.textContent = gameState.fish;
}

// Crea un elemento carta
function createCardElement(card, isHidden = false) {
    const cardEl = document.createElement('div');
    cardEl.className = 'card';

    if (isHidden) {
        cardEl.classList.add('card-back');
        return cardEl;
    }

    if (card.suit === 'hearts' || card.suit === 'diamonds') {
        cardEl.classList.add('red');
    } else {
        cardEl.classList.add('black');
    }

    let suitSymbol;
    switch(card.suit) {
        case 'hearts': suitSymbol = '♥'; break;
        case 'diamonds': suitSymbol = '♦'; break;
        case 'clubs': suitSymbol = '♣'; break;
        case 'spades': suitSymbol = '♠'; break;
    }

    cardEl.innerHTML = `
        <div style="position: absolute; top: 5px; left: 5px;">${card.value}</div>
        <div style="font-size: 1.8rem;">${suitSymbol}</div>
        <div style="position: absolute; bottom: 5px; right: 5px; transform: rotate(180deg);">${card.value}</div>
    `;

    return cardEl;
}

// Calcola il punteggio
function calculateScore(hand) {
    let score = 0;
    let aces = 0;

    for (let card of hand) {
        if (!card) continue;
        
        if (card.value === 'A') {
            aces++;
            score += 11;
        } else if (['K', 'Q', 'J'].includes(card.value)) {
            score += 10;
        } else {
            score += parseInt(card.value);
        }
    }

    while (score > 21 && aces > 0) {
        score -= 10;
        aces--;
    }

    return score;
}

// Controlla blackjack iniziale
function checkBlackjack() {
    const playerScore = calculateScore(gameState.playerHand);
    const dealerScore = calculateScore(gameState.dealerHand);

    if (playerScore === 21) {
        if (dealerScore === 21) {
            endGame('draw', 'Pareggio! Entrambi avete fatto Blackjack!');
        } else {
            endGame('win', 'Blackjack! Hai vinto!');
        }
    } else if (dealerScore === 21) {
        endGame('lose', 'Il banco ha fatto Blackjack! Hai perso.');
    }
}

// Turno del banco
function dealerTurn() {
    gameState.gameOver = true;
    updateUI();

    const dealerScore = calculateScore(gameState.dealerHand);
    const playerScore = calculateScore(gameState.playerHand);

    if (dealerScore < 17) {
        setTimeout(() => {
            gameState.dealerHand.push(drawCard());
            dealerTurn();
        }, 1000);
    } else {
        if (dealerScore > 21) {
            endGame('win', 'Il banco ha sballato! Hai vinto!');
        } else if (dealerScore > playerScore) {
            endGame('lose', 'Il banco vince con un punteggio più alto!');
        } else if (dealerScore < playerScore) {
            endGame('win', 'Hai vinto con un punteggio più alto!');
        } else {
            endGame('draw', 'Pareggio!');
        }
    }
}

// Termina il gioco
async function endGame(result, message) {
    gameState.gameOver = true;
    updateUI();

    showMessage(message, result);

    if (result === 'win') {
        gameState.fish += gameState.currentBet * 2;
    } else if (result === 'draw') {
        gameState.fish += gameState.currentBet;
    }

    try {
        await setFish(gameState.fish);
        updateFishDisplay();
    } catch (error) {
        console.error('Errore nel salvataggio delle fish:', error.message);
        showMessage('Errore nel salvataggio del saldo', 'lose');
    }

    elements.gameControls.style.display = 'none';
    elements.newGameBtn.style.display = 'block';
}

// Mostra un messaggio
function showMessage(text, type) {
    elements.gameMessage.textContent = text;
    elements.gameMessage.className = 'message ' + type;
    elements.gameMessage.classList.add('show');

    setTimeout(() => {
        elements.gameMessage.classList.remove('show');
    }, 5000);
}

// Resetta il gioco
async function resetGame() {
    try {
        gameState.fish = await getFish();
        gameState.playerHand = [];
        gameState.dealerHand = [];
        gameState.gameOver = true;
        gameState.currentBet = 0;

        elements.betControls.style.display = 'flex';
        elements.gameControls.style.display = 'none';
        elements.newGameBtn.style.display = 'none';
        elements.gameMessage.className = 'message';
        elements.gameMessage.textContent = '';

        updateUI();
    } catch (error) {
        console.error('Errore nel reset del gioco:', error.message);
        showMessage('Errore nel reset del gioco', 'lose');
    }
}

// Avvia il gioco
initGame();