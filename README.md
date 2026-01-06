# Doom Hygiene

**Eine minimalistische, mehrsprachige Web App als bewusste Alternative zu sinnlosem Doomscrolling.**

Scrollen – aber mit Substanz.

---

## 🧠 Konzept

Doom Hygiene ist eine Scroll-App, die ausschließlich hochwertige, lesenswerte Artikel anzeigt:
- Essays, Kultur, Wissenschaft, Technologie, Philosophie
- Kein Clickbait
- Keine Breaking News
- Nur durchdachte, tiefgründige Inhalte

---

## ✨ Features

### 🌍 Mehrsprachigkeit
- Unterstützt 8 Sprachen: EN, DE, FR, ES, IT, JP, KR, ZH
- Artikel werden nur in der gewählten Sprache angezeigt
- Keine automatische Übersetzung
- Sprachauswahl oben in der App

### 📰 Kuratierte Inhalte
- RSS-Feeds als Datenquelle
- Nach Sprache und Thema organisiert
- Themen werden zufällig gemischt
- Natürliches Scroll-Gefühl

### 🔀 Scroll-Erlebnis
- Vertikales, endloses Scrollen
- Lazy Loading beim Scrollen
- Sanfte Animationen
- Fokus auf Lesbarkeit

### ❤️ Interaktionen
Jeder Artikel bietet:
- ❤️ **Like** – Artikel positiv bewerten
- 🔖 **Bookmark** – Für später speichern
- ✓ **Als gelesen markieren** – Überblick behalten

Alle Zustände werden lokal im Browser gespeichert (localStorage).

### 🔒 Datenschutz
- ✅ Kein Login erforderlich
- ✅ Kein Backend
- ✅ Keine Tracker
- ✅ Keine externen Dienste
- ✅ Reines Frontend
- ✅ Alle Daten bleiben lokal auf deinem Gerät

---

## 🎨 Design-Prinzipien

- **Ruhig & kultiviert**: Kein Social-Media-Look
- **Fokus auf Lesbarkeit**: Hochwertige Schriftarten (Crimson Pro, Inter)
- **Dezente Farben**: Viel Weißraum
- **Sanfte Animationen**: Smooth & elegant
- **Responsive**: Funktioniert auf Desktop und Mobile

---

## 🚀 Installation & Nutzung

### Lokal starten

1. Repository klonen oder herunterladen:
```bash
git clone <repository-url>
cd DoomHygiene
```

2. Mit einem lokalen Server öffnen:

**Option 1: Python**
```bash
python3 -m http.server 8000
```

**Option 2: Node.js (mit npx)**
```bash
npx serve
```

**Option 3: VS Code Live Server**
- Installiere die "Live Server" Extension
- Rechtsklick auf `index.html` → "Open with Live Server"

3. Im Browser öffnen:
```
http://localhost:8000
```

### Als Web App installieren

Die App ist PWA-ready und kann auf Mobilgeräten als App installiert werden:
- **iOS**: Safari → Teilen → "Zum Home-Bildschirm"
- **Android**: Chrome → Menü → "Zum Startbildschirm hinzufügen"

---

## 📁 Projektstruktur

```
DoomHygiene/
│
├── index.html          # Haupt-HTML-Struktur
├── styles.css          # Alle Styles & Responsive Design
├── config.js           # App-Konfiguration
├── i18n.js             # Mehrsprachigkeit
├── storage.js          # LocalStorage-Management
├── feeds.js            # RSS-Feed-Parser & Konfiguration
├── app.js              # Haupt-App-Logik
├── manifest.json       # PWA Manifest
└── README.md           # Diese Datei
```

---

## 🛠️ Technologie-Stack

- **Vanilla JavaScript** (ES6+)
- **HTML5 & CSS3**
- **LocalStorage API** für Persistierung
- **RSS/Atom Feed Parsing**
- **CORS Proxy** (allorigins.win) für Feed-Abruf
- **Responsive Design** (Mobile First)

---

## 🌐 RSS-Feeds anpassen

Die RSS-Feeds können in der Datei `feeds.js` angepasst werden:

```javascript
const RSS_FEEDS = {
    en: [
        { url: 'https://example.com/feed.rss', category: 'philosophy', source: 'Example' },
        // Weitere Feeds...
    ],
    de: [
        // Deutsche Feeds...
    ]
    // Weitere Sprachen...
};
```

**Kategorien:**
- `philosophy` – Philosophie
- `science` – Wissenschaft
- `technology` – Technologie
- `culture` – Kultur
- `essay` – Essays
- `literature` – Literatur
- `art` – Kunst
- `history` – Geschichte

---

## 🔧 Konfiguration

In `config.js` können folgende Parameter angepasst werden:

```javascript
const CONFIG = {
    articlesPerLoad: 10,        // Artikel pro Ladevorgang
    scrollThreshold: 500        // Pixel vom Ende zum Nachladen
};
```

---

## 🎯 Verwendungszweck

**Für wen ist Doom Hygiene?**
- Menschen, die bewusster konsumieren möchten
- Leser, die Tiefe statt Klicks suchen
- Alle, die Doomscrolling durch Substanz ersetzen wollen

**Wann nutzen?**
- Statt Instagram/Twitter/TikTok
- Morgens beim Kaffee
- In der Mittagspause
- Abends zur Entspannung
- Immer, wenn du dich weiterbilden möchtest

---

## 🤝 Beitragen

Contributions sind willkommen! 

**Ideen für Erweiterungen:**
- Weitere Sprachen hinzufügen
- Neue kuratierte RSS-Feeds vorschlagen
- Dark Mode implementieren
- Offline-Support via Service Worker
- Export/Import von Bookmarks

---

## 📄 Lizenz

MIT License – Frei nutzbar für persönliche und kommerzielle Zwecke.

---

## 💡 Philosophie

> "Not all who scroll are lost – but most are distracted."

Doom Hygiene ist ein Experiment: Kann Social-Media-ähnliches Scrollen auch bildend sein?  
Kann Doom-Scrolling hygienisch werden?

Die Antwort: Ja – wenn der Content stimmt.

---

**Viel Freude beim bewussten Scrollen! 🌿**
