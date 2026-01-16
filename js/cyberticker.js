import { ISO_COUNTRY_MAP, normalizeCountry } from './iso_map.js';
import { COUNTRY_COORDS } from './koordinaten.js';

async function updateMapWithDShield() {
    try {
        const response = await fetch('/api/incidents');
        if (!response.ok) throw new Error("Proxy-Fehler");
        
        const data = await response.json();

        data.forEach((incident, index) => {
            // 1. Land normalisieren
            const countryName = normalizeCountry(incident.country);
            
            // 2. Koordinaten holen
            let coords = COUNTRY_COORDS[countryName];

            // 3. Fallback für unbekannte Standorte
            if (!coords) {
                coords = [Math.random() * 120 - 60, Math.random() * 300 - 150];
            }

            // 4. Jitter (Streuung), damit Punkte nicht exakt übereinander liegen
            const lat = coords[0] + (Math.random() * 4 - 2);
            const lon = coords[1] + (Math.random() * 4 - 2);

            // 5. Score-Bestimmung (DShield nutzt oft 'attacks' Feld)
            const riskScore = incident.attacks || 50;

            // 6. Zeitversetztes Zeichnen für Live-Effekt
            setTimeout(() => {
                addPointToMap(lat, lon, riskScore);
                updateTicker(incident.ip || "Unknown", countryName);
            }, index * 150);
        });
    } catch (e) {
        console.error("Cyber-Map Fehler:", e);
    }
}

function addPointToMap(lat, lon, score) {
    // Da das SVG direkt im HTML ist, greifen wir direkt darauf zu
    const svg = document.querySelector('svg');
    if (!svg) return;

    // Farbauswahl basierend auf Risiko
    let color = "#ffcc00"; // Niedrig (Gelb)
    if (score > 40) color = "#ff6600"; // Mittel (Orange)
    if (score > 80) color = "#d40000"; // Hoch (Taskvault-Rot)

    // Koordinaten-Umrechnung auf die SVG-ViewBox (hier 2000x857)
    const x = (lon + 180) * (2000 / 360);
    const y = (90 - lat) * (857 / 180);

    // SVG-Element erstellen
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", x);
    circle.setAttribute("cy", y);
    circle.setAttribute("r", "5");
    circle.setAttribute("fill", color);

    // Animation einfügen
    circle.innerHTML = `
        <animate attributeName="r" from="2" to="12" dur="1.5s" begin="0s" repeatCount="indefinite" />
        <animate attributeName="opacity" from="0.8" to="0" dur="1.5s" begin="0s" repeatCount="indefinite" />
    `;

    svg.appendChild(circle);

    // Punkt nach 15 Sekunden wieder entfernen
    setTimeout(() => circle.remove(), 15000);
}

function updateTicker(ip, country) {
    const ticker = document.getElementById('cyber-ticker');
    if (ticker) {
        const entry = ` +++ ALERT: Attack from ${ip} (${country}) +++ `;
        ticker.textContent = entry + ticker.textContent;
    }
}

// Initialer Start und Intervall (alle 5 Min)
updateMapWithDShield();
setInterval(updateMapWithDShield, 300000);