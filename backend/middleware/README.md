# Middleware di Autenticazione JWT

## Panoramica
Questo middleware gestisce l'autenticazione degli utenti utilizzando JSON Web Tokens (JWT). Verifica la validità dei token di accesso e protegge le route dell'applicazione.

## Funzionalità
- Verifica dei token JWT
- Protezione delle route
- Gestione degli errori di autenticazione
- Recupero delle informazioni utente

## Requisiti
- Node.js
- jsonwebtoken
- MongoDB con Mongoose
- Variabili d'ambiente configurate

## Configurazione

### Installazione Dipendenze
```bash
npm install jsonwebtoken mongoose
```

## Utilizzo

### Protezione delle Route
```javascript
const authMiddleware = require('./middleware/authMiddleware');

// Proteggere una singola route
app.get('/protected-route', authMiddleware, (req, res) => {
  // La route è accessibile solo con token valido
});

// Proteggere un gruppo di route
router.use(authMiddleware);
```

### Accesso ai Dati Utente
Nelle route protette, i dati dell'utente sono disponibili in `req.user`:
```javascript
app.get('/profile', authMiddleware, (req, res) => {
  const userData = req.user;
  res.json(userData);
});
```

## Struttura Token
Il token deve essere inviato nell'header Authorization:
```
Authorization: Bearer <token>
```

## Gestione Errori
Il middleware gestisce diversi scenari di errore:

1. **Token Mancante**
   - Status: 401
   - Messaggio: "Authentication required"

2. **Token Scaduto**
   - Status: 401
   - Messaggio: "Token expired"

3. **Token Non Valido**
   - Status: 401
   - Messaggio: "Invalid token"

4. **Utente Non Trovato**
   - Status: 404
   - Messaggio: "User not found"

## Sicurezza

### Best Practices Implementate
1. **Esclusione Password**
   - La password dell'utente viene sempre esclusa dalle query
   - Previene l'esposizione accidentale di dati sensibili

2. **Gestione Token**
   - Verifica della presenza del token
   - Validazione della firma del token
   - Gestione separata dei token scaduti

3. **Gestione Errori**
   - Messaggi di errore specifici
   - Status code appropriati
   - Gestione sicura delle eccezioni

### Raccomandazioni
1. **JWT Secret**
   - Utilizzare una stringa complessa e lunga
   - Cambiare periodicamente la chiave
   - Non committare mai il secret nel codice

## Note di Sviluppo
- Il middleware è asincrono per gestire le query al database
- Utilizza optional chaining per una gestione sicura degli header
- Supporta il pattern Bearer token standard

## Risoluzione Problemi
1. **Token Non Valido**
   - Verificare il formato del token
   - Controllare la chiave JWT_SECRET
   - Verificare la scadenza del token

2. **Utente Non Trovato**
   - Verificare l'ID utente nel token
   - Controllare il database
   - Verificare la connessione MongoDB