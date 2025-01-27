# Route dell'Applicazione

## Panoramica
Questo documento descrive le route API disponibili nell'applicazione degli eventi di Trento. Il sistema include due router principali: autenticazione (auth.js) ed eventi (events.js).

## Route di Autenticazione
Gli esempi sotto riportano le password in chiaro, se richiesti dal database verranno mostrati sottoforma di valori casuali in quanto criptate.

### Registrazione Utente
```
POST /api/auth/register
```
**Body richiesta:**
```json
{
    "email": "user@example.com",
    "password": "password123"
}
```
**Risposta di successo:**
```json
{
    "message": "Registration successful",
    "token": "jwt_token",
    "user": {
        "email": "user@example.com",
        "role": "free"
    }
}
```

### Login Utente
```
POST /api/auth/login
```
**Body richiesta:**
```json
{
    "email": "user@example.com",
    "password": "password123"
}
```
**Risposta di successo:**
```json
{
    "message": "Login successful",
    "token": "jwt_token",
    "user": {
        "email": "user@example.com",
        "role": "free"
    }
}
```

### Cambio Password
```
POST /api/auth/change-password
```
**Headers:**
```
Authorization: Bearer jwt_token
```
**Body richiesta:**
```json
{
    "currentPassword": "password123",
    "newPassword": "newpassword123"
}
```
**Risposta di successo:**
```json
{
    "message": "Password updated successfully"
}
```

## Route Eventi

### Ottenere Tutti gli Eventi
```
GET /api/events
```
**Risposta di successo:**
```json
[
    {
        "apiId": "evento123",
        "title": "Concerto in Piazza",
        "description": "Descrizione evento",
        "date": "2024-02-01T20:00:00.000Z",
        "coordinates": {
            "lat": 46.0748,
            "lng": 11.1217
        },
        "venue": "Piazza Duomo",
        "category": "music"
    }
]
```

### Salvare un Evento
```
POST /api/events/save/:eventId
```
**Headers:**
```
Authorization: Bearer jwt_token
```
**Risposta di successo:**
```json
{
    "message": "Event saved successfully",
    "savedEvents": ["eventId1", "eventId2"]
}
```

### Rimuovere un Evento Salvato
```
DELETE /api/events/save/:eventId
```
**Headers:**
```
Authorization: Bearer jwt_token
```
**Risposta di successo:**
```json
{
    "message": "Event removed from saved"
}
```

### Ottenere Eventi Salvati
```
GET /api/events/saved
```
**Headers:**
```
Authorization: Bearer jwt_token
```
**Risposta di successo:**
```json
[
    {
        "apiId": "evento123",
        "title": "Concerto in Piazza",
        // ... altri dettagli dell'evento
    }
]
```

## Gestione Errori

### Codici di Stato
- 200: Successo
- 201: Creazione completata
- 400: Richiesta non valida
- 401: Non autorizzato
- 404: Risorsa non trovata
- 500: Errore del server

### Esempi di Errori
```json
{
    "error": "Email already registered"
}
```
```json
{
    "error": "Invalid token"
}
```

## Autenticazione

### Token JWT
- Generato al login e alla registrazione
- Validità: 24 ore
- Da includere in tutti gli header delle richieste protette
- Formato: `Bearer <token>`

### Sicurezza
1. **Password**
   - Hash con bcrypt
   - Salt generato automaticamente
   - Validazione lato server

2. **Token**
   - Firma JWT con chiave segreta
   - Verifica token in ogni richiesta protetta
   - Gestione scadenza token

## Utilizzo

### Esempi con cURL

**Registrazione:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

**Salvare un Evento:**
```bash
curl -X POST http://localhost:5000/api/events/save/event123 \
  -H "Authorization: Bearer <your_token>"
```

## Test

### Postman
1. Importare la collection fornita
2. Configurare le variabili d'ambiente:
   - `baseUrl`: URL base dell'API
   - `token`: Token JWT dopo il login

### Jest
```bash
npm test
```

### Errori Comuni
1. **Token non valido**
   - Verificare la scadenza del token
   - Controllare il formato dell'header

2. **Errori di Salvataggio Eventi**
   - Verificare l'ID dell'evento
   - Controllare l'autenticazione

## Note per lo Sviluppo
- Utilizzare variabili d'ambiente per le configurazioni
- Gestire correttamente gli errori asincroni
- Validare sempre i dati in input
- Mantenere la consistenza nelle risposte API