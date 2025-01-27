# Configurazione Database MongoDB

## Panoramica
Questo file gestisce la connessione al database MongoDB per l'applicazione degli eventi di Trento. Utilizza Mongoose come ODM (Object Data Modeling) per semplificare le interazioni con MongoDB.

## Requisiti
- Node.js
- MongoDB
- Mongoose
- File `.env` con la variabile `MONGO_URI` configurabile nella in ./backend

## Struttura del File
Il file `database.js` contiene la configurazione principale per la connessione al database MongoDB.

### Importazioni
```javascript
const mongoose = require('mongoose');
```
Importa il modulo Mongoose necessario per interagire con MongoDB.

### Opzioni di Configurazione
```javascript
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
};
```

Le opzioni di configurazione includono:
- `useNewUrlParser`: Utilizza il nuovo parser URL di MongoDB
- `useUnifiedTopology`: Utilizza il nuovo motore di monitoraggio del server
- `serverSelectionTimeoutMS`: Tempo di attesa per la selezione del server (30 secondi)
- `socketTimeoutMS`: Tempo di attesa per il completamento delle operazioni (45 secondi)

### Gestione degli Errori
Il file implementa diversi gestori di eventi per monitorare lo stato della connessione:
- Errori di connessione
- Eventi di disconnessione
- Tentativi di riconnessione automatica

Se si verifica un errore di connessione critico, l'applicazione si chiuderà con un codice di errore (1).

## Note per lo Sviluppo
- Assicurarsi che MongoDB sia in esecuzione prima di avviare l'applicazione
- Verificare che la stringa di connessione nel file `.env` sia corretta
- Monitorare i log per eventuali errori di connessione

## Risoluzione dei Problemi
1. **Errore di Connessione**
   - Verificare che MongoDB sia in esecuzione
   - Controllare la stringa di connessione
   - Verificare le credenziali nel file `.env`

2. **Timeout di Connessione**
   - Controllare la connessione di rete
   - Verificare che il server MongoDB sia accessibile
   - Aumentare i valori di timeout se necessario

3. **Errori di Autenticazione**
   - Controllare i permessi del database e le porte di accesso siano quelle impostate