# Schema del Database

## Panoramica
Questo documento descrive gli schema MongoDB utilizzati nell'applicazione degli eventi di Trento. Il sistema utilizza due modelli principali: Event (Eventi) e User (Utenti).

## Schema Eventi (Event)

### Struttura
```javascript
{
    apiId: String,          // ID univoco dall'API di Trento
    title: String,          // Titolo dell'evento
    description: String,    // Descrizione dell'evento
    date: Date,            // Data e ora
    coordinates: {          // Posizione geografica
        lat: Number,
        lng: Number
    },
    venue: String,          // Luogo dell'evento
    category: String,       // Categoria
    originalType: String    // Tipo
    createdAt: Date,       // Data di creazione (automatico)
    updatedAt: Date        // Data di ultimo aggiornamento (automatico)
}
```

### Validazioni
- **apiId**: Richiesto e univoco
- **title**: Richiesto
- **date**: Richiesta
- **coordinates**: Latitudine e longitudine richieste
- **category**: Limitata a: ['cultural', 'sport', 'music', 'food', 'art', '']

### Valori Default
- **description**: 'No description available'
- **venue**: 'Unknown location'
- **category**: '' (stringa vuota)

## Schema Utenti (User)

### Struttura
```javascript
{
    email: String,         // Email dell'utente
    password: String,      // Password hashata
    role: String,         // Ruolo utente
    savedEvents: [         // Array di eventi salvati
        ObjectId          // Riferimenti agli eventi
    ]
}
```

### Validazioni
- **email**: Richiesto e univoco
- **password**: Richiesto (viene hashato automaticamente)
- **role**: Limitato a: ['free', 'subscribed']

### Funzionalità di Sicurezza
- Password hashate usando bcrypt (12 rounds)
- Hashing automatico pre-salvataggio
- Nessun salvataggio di password in chiaro

## Utilizzo

### Creazione Nuovo Evento
```javascript
const Event = require('./models/Event');

const newEvent = new Event({
    apiId: 'evento123',
    title: 'Concerto in Piazza',
    date: new Date(),
    coordinates: {
        lat: 46.0748,
        lng: 11.1217
    }
});

await newEvent.save();
```

### Creazione Nuovo Utente
```javascript
const User = require('./models/User');

const newUser = new User({
    email: 'user@example.com',
    password: 'password123'  // Verrà hashata automaticamente
});

await newUser.save();
```

### Salvare un Evento per un Utente
```javascript
const user = await User.findById(userId);
user.savedEvents.push(eventId);
await user.save();
```

## Relazioni tra Schema

### Eventi → Utenti
- Gli eventi sono indipendenti dagli utenti
- Vengono popolati dall'API di Trento
- Possono essere salvati da più utenti

### Utenti → Eventi
- Gli utenti possono salvare più eventi
- Riferimento tramite savedEvents array
- Utilizzo di populate() per caricare i dettagli degli eventi

## Indicizzazione
Gli indici sono creati automaticamente per:
- `apiId` negli Eventi (unique)
- `email` negli Utenti (unique)
- `_id` in entrambi (default MongoDB)

## Manutenzione

### Pulizia Database
```javascript
// Rimuovere eventi passati
await Event.deleteMany({ date: { $lt: new Date() } });

// Rimuovere riferimenti a eventi non esistenti
await User.updateMany(
    {}, 
    { $pull: { savedEvents: { $nin: existingEventIds } } }
);
```

### Backup
```javascript
// Esempio di backup degli schema
mongoexport --collection=events --db=yourdb --out=events.json
mongoexport --collection=users --db=yourdb --out=users.json
```