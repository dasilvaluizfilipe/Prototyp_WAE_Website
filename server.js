const express = require('express');
const app = express();
const PORT = 3000;

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