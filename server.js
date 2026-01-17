const express = require('express');
const app = express();
const PORT = 3000;
const Parser = require('rss-parser');
const parser = new Parser();

// Statische Dateien aus dem Hauptordner servieren
app.use(express.static('.'));

// API Proxy für DShield
app.get('/api/incidents', async (req, res) => {
    try {
        const response = await fetch('https://isc.sans.edu/api/sources/shorthostnames/100?json');
        const data = await response.json();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'API Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Taskvault Node-Server läuft auf http://localhost:${PORT}`);
});

app.get('/api/news', async (req, res) => {
    try {
        // Beispiel: Heise Security RSS
        const feed = await parser.parseURL('https://www.heise.de/security/rss/news-atom.xml');
        // Wir senden nur Titel und Link an das Frontend
        const items = feed.items.map(item => ({ title: item.title, link: item.link }));
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: 'News konnten nicht geladen werden' });
    }
});
