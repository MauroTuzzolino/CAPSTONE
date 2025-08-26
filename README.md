# 🌌 BLACKHOLE

Un sito web informativo dedicato all'astronomia, basato sulle Spaceflight News API e arricchito con funzionalità social.

---

## 📌 Descrizione del Progetto

**BLACKHOLE** è un'applicazione web che permette agli appassionati di astronomia di consultare notizie e contenuti spaziali provenienti dalle **Spaceflight News API**, integrati con funzionalità personalizzate:

- Possibilità di **aggiungere mi piace e commenti** agli articoli (solo utenti autenticati).
- Sistema di **autenticazione e registrazione** utenti.
- Ruoli differenziati (**ADMIN** e **USER**), con privilegi extra per l’amministratore.

L’obiettivo è creare un **social informativo a tema spazio**, con un’interfaccia semplice e intuitiva.

---

## 🚀 Tecnologie Utilizzate

### **Frontend**

- [React]
- [React-Bootstrap]

### **Backend**

- **Java** con [Spring Boot]
- [PostgreSQL] come database relazionale
- **Spring Security** con JWT per autenticazione e autorizzazione

### **API Esterne**

- [Spaceflight News API](https://api.spaceflightnewsapi.net)

### **Altre dipendenze**

- **Bcrypt** per hashing password
- **Cloudinary** per la gestione delle immagini profilo

---

## 📂 Struttura dell’Applicazione

### **Frontend**

- **Home Page** → Visualizza i post provenienti dalle Spaceflight News API + funzionalità aggiuntive (like/commenti)
- **Pagina Profilo** → Login, Registrazione e gestione profilo utente

### **Backend**

- **Autenticazione e Autorizzazione** con JWT
- **Gestione Ruoli**:
  - **ADMIN** → Gestione utenti, moderazione commenti, funzionalità avanzate
  - **USER** → Possibilità di interagire con i post (like/commenti)

---

## ✅ Funzionalità Principali

- ✅ Consultazione notizie astronomiche in tempo reale
- ✅ Registrazione e login utente
- ✅ Sistema di **like** e **commenti**
- ✅ Ruoli con permessi dedicati (ADMIN / USER)
- ✅ Integrazione con **Spaceflight News API**

---

## 🔐 Autenticazione

- **JWT Token** per gestire sessioni sicure
- Accesso alle funzionalità social (like/commenti) **solo per utenti autenticati**

---

## 👤 Ruolo Admin

- Può gestire gli utenti
- Può eliminare/moderare commenti

---

### 🔭 Obiettivo finale

Creare una piattaforma informativa e interattiva per tutti gli amanti dello spazio!
