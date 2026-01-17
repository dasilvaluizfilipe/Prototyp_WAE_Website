import { ISO_COUNTRY_MAP, normalizeCountry } from './iso_map.js';
import { COUNTRY_COORDS } from './koordinaten.js';

async function updateMapWithDShield() {
    try {
        const response = await fetch('/api/incidents');
        if (!response.ok) throw new Error("Proxy-Fehler");
        
        const data = await response.json();
        if (data.length === 0) return;

        // 100 Einträge auf 5 Minuten (300.000ms) verteilen
        // Das ergibt ca. alle 3 Sekunden einen neuen Punkt
        const totalDuration = 300000; 
        const interval = totalDuration / data.length;

        data.forEach((incident, index) => {
            setTimeout(() => {
                const countryName = normalizeCountry(incident.country);
                let coords = COUNTRY_COORDS[countryName];

                // Fallback falls Land nicht in deiner Liste
                if (!coords) {
                    coords = [Math.random() * 120 - 60, Math.random() * 300 - 150];
                }

                const lat = coords[0] + (Math.random() * 4 - 2);
                const lon = coords[1] + (Math.random() * 4 - 2);

                // Punkte zeichnen und Ticker füttern
                addPointToMap(lat, lon, incident.count);
                updateTicker(incident.ip, countryName);
                
            }, index * interval);
        });
    } catch (e) {
        console.error("Cyber-Map Fehler:", e);
    }
}

function addPointToMap(lat, lon, score) {
    const svg = document.getElementById("mapObject"); // Gezielter Zugriff über ID
    if (!svg) return;

    let color = "#ffcc00"; 
    if (score > 40) color = "#ff6600"; 
    if (score > 80) color = "#00FF00"; // Hackergrün für hohe Prio

    const x = (lon + 180) * (2000 / 360);
    const y = (90 - lat) * (857 / 180);

    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", x);
    circle.setAttribute("cy", y);
    circle.setAttribute("r", "5");
    circle.setAttribute("fill", color);
    circle.style.pointerEvents = "none"; // Stört Heatmap-Hover nicht

    circle.innerHTML = `
        <animate attributeName="r" from="2" to="12" dur="1.5s" begin="0s" repeatCount="indefinite" />
        <animate attributeName="opacity" from="0.8" to="0" dur="1.5s" begin="0s" repeatCount="indefinite" />
    `;

    svg.appendChild(circle);
    setTimeout(() => circle.remove(), 15000);
}
let tickerQueue = [];
let isProcessing = false;

function updateTicker(ip, country) {
    tickerQueue.push({ ip, country });
    if (!isProcessing) processQueue();
}

let tickerPos = window.innerWidth;
const tickerSpeed = 1.5; // Pixel pro Frame (höher = schneller)

function startSmoothScroll() {
    const ticker = document.getElementById('cyber-ticker');
    if (!ticker) return;

    tickerPos -= tickerSpeed;
    ticker.style.transform = `translateX(${tickerPos}px)`;

    // Wenn der gesamte Text links verschwunden ist, reset nach rechts
    if (tickerPos < -ticker.offsetWidth) {
        tickerPos = window.innerWidth;
    }

    requestAnimationFrame(startSmoothScroll);
}

async function processQueue() {
    isProcessing = true;
    const ticker = document.getElementById('cyber-ticker');
    
    while (tickerQueue.length > 0) {
        const { ip, country, service } = tickerQueue.shift();
        
        if (ticker) {
            const span = document.createElement('span');
            span.className = 'ticker-entry';
            // Anzeige von Angreifer UND Ziel-Dienst
            span.textContent = ` +++ ALERT: [${service}] Attack from ${ip} (${country}) +++ `;
            ticker.appendChild(span);

            if (ticker.childNodes.length > 30) {
                ticker.removeChild(ticker.firstChild);
            }
        }
        await new Promise(r => setTimeout(r, 3000));
    }
    isProcessing = false;
}

// Initialisierung
document.addEventListener('DOMContentLoaded', () => {
    startSmoothScroll();
});

// Initialer Start und Intervall (alle 5 Min passend zum Daten-Batch)
updateMapWithDShield();
setInterval(updateMapWithDShield, 300000);