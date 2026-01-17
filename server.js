const express = require('express');
const app = express();
const PORT = 3000;
const Parser = require('rss-parser');
const parser = new Parser();

// Statische Dateien aus dem Hauptordner servieren
app.use(express.static('.'));

app.get('/api/incidents', async (req, res) => {
    try {
        const response = await fetch('https://api.abuseipdb.com/api/v2/check');
        const text = await response.text();
        
        // CSV zu JSON konvertieren
        const lines = text.trim().split('\n');
        const data = lines.map(line => {
            const parts = line.split(',');
            return {
                ip: parts[0] || "Unknown",
                country: parts[1] ,
                count: Math.floor(Math.random() * 100) + 20 // Simulation der Intensität
            };
        });

        res.json(data.slice(0, 50)); // Nur die ersten 50 für bessere Performance
    } catch (err) {
        res.status(500).json({ error: "HackerTarget API Fehler" });
    }
});

app.listen(PORT, () => {
    console.log(`Taskvault Node-Server läuft auf http://localhost:${PORT}`);
});

app.listen(PORT, () => console.log(`Server läuft auf http://localhost:${PORT}`));

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
