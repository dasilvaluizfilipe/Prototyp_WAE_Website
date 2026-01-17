const express = require('express');
const cors = require('cors'); // Empfohlen für API-Zugriffe
const app = express();
const PORT = process.env.PORT || 3000;
const Parser = require('rss-parser');
const parser = new Parser();

app.use(cors());
app.use(express.static('.'));

// API für Incidents
app.get('/api/incidents', async (req, res) => {
    try {
        const response = await fetch('https://api.abuseipdb.com/api/v2/check');
        const text = await response.text();
        
        const lines = text.trim().split('\n');
        const data = lines.map(line => {
            const parts = line.split(',');
            return {
                ip: parts[0] || "Unknown",
                country: parts[1],
                count: Math.floor(Math.random() * 100) + 20 
            };
        });

        res.json(data.slice(0, 50));
    } catch (err) {
        res.status(500).json({ error: "API Fehler" });
    }
});

// API für News
app.get('/api/news', async (req, res) => {
    try {
        const feed = await parser.parseURL('https://www.heise.de/security/rss/news-atom.xml');
        const items = feed.items.map(item => ({ title: item.title, link: item.link }));
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: 'News Fehler' });
    }
});

app.listen(PORT, () => {
    console.log(`Taskvault Server läuft auf Port ${PORT}`);
});