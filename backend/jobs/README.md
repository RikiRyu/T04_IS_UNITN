# Sistema di Recupero Eventi di Trento

## Panoramica
Questo sistema è composto da due file principali che gestiscono il recupero e l'aggiornamento automatico degli eventi dalla API del Comune di Trento.

## File del Sistema

### fetchEvents.js
Questo file gestisce il recupero degli eventi dall'API del Comune di Trento e il loro salvataggio nel database.

#### Funzionalità Principali
- Recupero dati dall'API pubblica del Comune di Trento
- Pulizia e normalizzazione dei dati
- Gestione della paginazione dei risultati
- Mappatura delle categorie di eventi dall'italiano all'inglese
- Aggiornamento automatico del database MongoDB

#### Funzioni Principali
1. `getEventType(name)`
   - Converte le categorie di eventi dall'italiano all'inglese
   - Mappa categorie come 'cultura' → 'cultural', 'sport' → 'sport', ecc.

2. `cleanDescription(text)`
   - Rimuove i tag HTML dalle descrizioni
   - Normalizza gli spazi e i caratteri speciali
   - Gestisce i casi di testo mancante

3. `fetchEvents()`
   - Funzione principale che gestisce l'intero processo di recupero
   - Elimina gli eventi passati dal database
   - Processa tutti i risultati paginati
   - Aggiorna il database con i nuovi eventi

### schedule.js
Questo file gestisce la pianificazione automatica del recupero degli eventi.

#### Funzionalità
- Utilizza node-cron per la pianificazione dei task
- Esegue il recupero degli eventi ogni giorno a mezzanotte
- Mantiene il database aggiornato automaticamente, questa è implementata nel caso in cui il server funzionasse 24h/24h. Ogni volta che si riavvia il server manualmente questa procedura viene effettuata automaticamente.

## Requisiti
- Node.js
- MongoDB
- Accesso all'API del Comune di Trento (Dati sono OpenSource forniti dal Comune sulla sua piattaforma)
- Pacchetti npm:
  - axios
  - node-cron
  - mongoose

### Avvio Automatico
Il sistema si avvia automaticamente con l'applicazione e continua a funzionare in background.

## Struttura dei Dati
Gli eventi vengono salvati nel database con la seguente struttura:
```javascript
{
  apiId: String,          // ID univoco dell'evento
  title: String,          // Titolo dell'evento
  description: String,    // Descrizione
  date: Date,            // Data dell'evento
  coordinates: {          // Coordinate geografiche
    lat: Number,
    lng: Number
  },
  venue: String,          // Luogo dell'evento
  category: String,       // Categoria
  originalType: String    // Categoria originale
}
```

### Risoluzione Problemi Comuni
1. **Errori API**
   - Verificare che l'URL dell'API sia corretto
   - Controllare i limiti di richieste

2. **Errori Database**
   - Verificare la connessione MongoDB
   - Controllare lo spazio disponibile

3. **Errori di Pianificazione**
   - Verificare che node-cron sia in esecuzione
   - Controllare il formato della pianificazione

## Note di Sviluppo
- Il sistema elimina automaticamente gli eventi passati
- La mappatura delle categorie può essere estesa nel typeMap
- La pianificazione può essere modificata nel file schedule.js