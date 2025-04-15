// js/fishService.js

/**
 * Ottiene il numero di fish dell'utente corrente dal server.
 * @returns {Promise<number>} - Numero di fish dell'utente.
 */
export async function getFishCount() {
    try {
        const response = await fetch('/php/get_fish.php');
        const data = await response.json();

        if (data.success) {
            return data.fish;
        } else {
            console.error('Errore:', data.error);
            return 0;
        }
    } catch (error) {
        console.error('Errore nella richiesta:', error);
        return 0;
    }
}
