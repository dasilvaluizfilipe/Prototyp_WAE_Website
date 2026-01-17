const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
const Parser = require('rss-parser');
const parser = new Parser();

app.use(cors());
app.use(express.static('.'));

const geoip = require('geoip-lite');

const serviceMap = {
    22: "SSH",
    23: "Telnet",
    80: "HTTP",
    443: "HTTPS",
    3389: "RDP",
    445: "SMB",
    5060: "SIP"
};

app.get('/api/incidents', async (req, res) => {
    try {
        const response = await fetch('https://isc.sans.edu/api/sources/shodan/100?json');
        const json = await response.json();

        const data = json.map(item => {
            const geo = geoip.lookup(item.ip);
            // DShield liefert oft den Port im Feld 'port'
            const port = item.port || 22; 
            const service = serviceMap[port] || `Port ${port}`;

            return {
                ip: item.ip,
                country: geo ? geo.country : "Unknown",
                service: service, // Was getroffen wurde
                count: Math.min(100, Math.floor(item.attacks / 100))
            };
        });

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Fehler' });
    }
});

/*
app.get('/api/incidents', async (req, res) => {
    try {
        const API_KEY = '39f56082b82916ba0224870b3f79bc60c49d1a262d7fe91b787679fd48c76cfb6e107eda542be878'; 
        // Wir laden 500 Einträge auf einmal
        const response = await fetch('https://api.abuseipdb.com/api/v2/blacklist?confidenceMinimum=90&limit=500', {
            method: 'GET',
            headers: {
                'Key': API_KEY,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) return res.status(response.status).json({ error: "API Key ungültig?" });

        const json = await response.json();
        const data = json.data.map(item => ({
            ip: item.ipAddress,
            country: item.countryCode,
            count: item.abuseConfidenceScore
        }));

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: "Server Fehler" });
    }
});
*/
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
    console.log(`B.R.O.K.E.N.A.R.R.O.W Server aktiv auf Port ${PORT}`);
});