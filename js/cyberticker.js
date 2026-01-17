import { ISO_COUNTRY_MAP, normalizeCountry } from './iso_map.js';
import { COUNTRY_COORDS } from './koordinaten.js';

async function updateMapWithDShield() {
    try {
        const response = await fetch('/api/incidents');
        if (!response.ok) throw new Error("Proxy-Fehler");
        
        const data = await response.json();

        data.forEach((incident, index) => {
            // 1. Land normalisieren
            const countryName = normalizeCountry(incident.country) || "Unknown";
            
            // 2. Koordinaten holen
            let coords = COUNTRY_COORDS[countryName];

            // 3. Fallback für unbekannte Standorte
            if (!coords) {
                coords = [Math.random() * 120 - 60, Math.random() * 300 - 150];
            }

            // 4. Jitter (Streuung)
            const lat = coords[0] + (Math.random() * 4 - 2);
            const lon = coords[1] + (Math.random() * 4 - 2);

            // 5. Score
            const riskScore = parseInt(incident.attacks) || 50;

            // 6. Zeitversetztes Zeichnen (Alle 2 Sekunden ein neuer Punkt/Ticker-Eintrag)
            setTimeout(() => {
                addPointToMap(lat, lon, riskScore);
                updateTicker(incident.ip || "Unknown", countryName);
            }, index * 2000); // Erhöht auf 2000ms, damit der Ticker lesbar bleibt
        });
    } catch (e) {
        console.error("Cyber-Map Fehler:", e);
    }
}

function addPointToMap(lat, lon, score) {
    const svg = document.querySelector('svg');
    if (!svg) return;

    let color = "#ffcc00"; 
    if (score > 40) color = "#ff6600"; 
    if (score > 80) color = "#d40000"; 

    // Koordinaten-Umrechnung (Equirectangular Projection)
    const x = (lon + 180) * (2000 / 360);
    const y = (90 - lat) * (857 / 180);

    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", x);
    circle.setAttribute("cy", y);
    circle.setAttribute("r", "5");
    circle.setAttribute("fill", color);

    circle.innerHTML = `
        <animate attributeName="r" from="2" to="12" dur="1.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" from="0.8" to="0" dur="1.5s" repeatCount="indefinite" />
    `;

    svg.appendChild(circle);
    setTimeout(() => circle.remove(), 15000);
}

function updateTicker(ip, country) {
    const ticker = document.getElementById('cyber-ticker');
    if (ticker) {
        // Wir zeigen nur den aktuellsten Alert an oder begrenzen die Länge
        ticker.innerHTML = `<span style="color: #d40000;">[ALERT]</span> Attack from ${ip} (${country})`;
    }
}

updateMapWithDShield();
setInterval(updateMapWithDShield, 300000);