# Componenti Frontend - Trento Events

## Panoramica
Questi componenti React formano l'interfaccia utente dell'applicazione Trento Events, consentendo agli utenti di visualizzare, cercare e salvare eventi nella città di Trento.

## Componenti Principali

### MapComponent
- Componente principale che visualizza la mappa interattiva
- Integra OpenStreetMap tramite React-Leaflet
- Gestisce la visualizzazione degli eventi sulla mappa
- Contiene la logica per il filtraggio e la selezione degli eventi

### FilterBar
- Fornisce controlli per filtrare gli eventi
- Permette la ricerca per:
  - Termine di ricerca
  - Data
  - Categoria

### AccountManager
- Gestisce le funzionalità dell'account utente
- Permette il cambio password
- Gestisce il logout
- Supporta la modalità chiara/scura

### SignInPopup
- Gestisce registrazione e login utenti
- Implementa validazione password
- Fornisce feedback visivo per gli errori
- Supporta la modalità chiara/scura

### SavedEvents
- Visualizza gli eventi salvati dall'utente
- Permette di rimuovere eventi dai preferiti
- Aggiorna in tempo reale la lista eventi

### EventList & EventDetails
- Visualizzano le informazioni degli eventi
- Supportano la visualizzazione dettagliata
- Gestiscono il rendering condizionale delle informazioni

### ThemeToggle
- Gestisce il cambio tema chiaro/scuro
- Fornisce un'interfaccia utente intuitiva

## Funzionalità Chiave
- Autenticazione utenti
- Gestione tema chiaro/scuro
- Visualizzazione eventi su mappa
- Filtraggio eventi
- Salvataggio eventi preferiti
- Interfaccia responsive

## Dipendenze Principali
- React
- React-Leaflet
- Lucide React (icone)
- Tailwind CSS (stili)

## Note Tecniche
- I componenti utilizzano hooks di React per la gestione dello stato
- L'autenticazione è gestita tramite JWT
- Il tema scuro è implementato tramite variabili CSS dinamiche
- La gestione degli errori include feedback visivi per l'utente