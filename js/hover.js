import { normalizeCountry } from "./iso_map.js";
import { COUNTRY_COORDS } from './koordinaten.js';

function drawArrow(attackerName, defenderName) {
    const svg = document.getElementById("mapObject");
    const att = COUNTRY_COORDS[attackerName];
    const def = COUNTRY_COORDS[defenderName];

    if (!att || !def) return;

    const x1 = (att[1] + 180) * (2000 / 360);
    const y1 = (90 - att[0]) * (857 / 180);
    const x2 = (def[1] + 180) * (2000 / 360);
    const y2 = (90 - def[0]) * (857 / 180);

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    line.setAttribute("stroke", "#00FF00");
    line.setAttribute("stroke-width", "2");
    line.setAttribute("marker-end", "url(#arrowhead)");
    line.classList.add("attack-arrow");

    // Flow-Animation
    const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    line.style.strokeDasharray = length;
    line.style.strokeDashoffset = length;
    
    // Animation via inline CSS
    line.style.transition = "stroke-dashoffset 0.6s ease-out";
    svg.appendChild(line);
    
    // Trigger animation
    setTimeout(() => {
        line.style.strokeDashoffset = "0";
    }, 10);
}

document.addEventListener("DOMContentLoaded", () => {
    const svg = document.getElementById("mapObject");
    const tooltip = document.getElementById("tooltip");
    if (!svg) return;

    Promise.all([
        fetch("../data/countries_index.json").then(res => res.json()),
        fetch("../data/countries_index2.json").then(res => res.json())
    ]).then(([countryStats, detailData]) => {
        
        const countries = svg.querySelectorAll(".country");
        const values = Object.values(countryStats);
        const maxValue = values.length > 0 ? Math.max(...values) : 0;

        countries.forEach(c => {
            const rawId = c.getAttribute("id") || c.getAttribute("data-name");
            if (!rawId) return;

            const countryName = normalizeCountry(rawId);
            const value = countryStats[countryName] ?? 0;

            // --- HEATMAP LOGIK ---
            if (value <= 0) {
                c.style.fill = "#ffffff";
            } else {
                let logValue = Math.log(value + 1);
                let logMax = Math.log(maxValue + 1);
                let t = Math.pow(logValue / logMax, 0.5);
                t = Math.max(0, Math.min(1, t));

                let r = 255, g, b;
                if (t < 0.33) {
                    g = 255;
                    b = Math.round(255 * (1 - t / 0.33));
                } else if (t < 0.66) {
                    g = Math.round(255 * (1 - (t - 0.33) * 0.8));
                    b = 0;
                } else {
                    g = Math.round(185 * (1 - (t - 0.66) / 0.34));
                    b = 0;
                }
                c.style.fill = `rgb(${r},${g},${b})`;
            }

            // --- EVENT LISTENERS ---
            c.addEventListener("mouseenter", () => {
                c.dataset.oldStroke = c.getAttribute("stroke") || "#000";
                c.setAttribute("stroke", "#ff0000");
                c.setAttribute("stroke-width", "1");

                tooltip.innerHTML = `<strong>${countryName}</strong><br>Angriffe: ${value}`;
                tooltip.style.display = "block";

                // Pfeile aus countries_index2.json zeichnen
                const details = detailData[countryName];
                if (details && details.sources) {
                    Object.keys(details.sources).forEach(attackerRaw => {
                        if (attackerRaw === "Unknown") return;
                        const normAttacker = normalizeCountry(attackerRaw);
                        drawArrow(normAttacker, countryName);
                    });
                }
            });

            c.addEventListener("mousemove", (e) => {
                tooltip.style.left = (e.pageX + 15) + "px";
                tooltip.style.top = (e.pageY - 40) + "px";
            });

            c.addEventListener("mouseleave", () => {
                tooltip.style.display = "none";
                c.setAttribute("stroke", c.dataset.oldStroke || "#000");
                c.setAttribute("stroke-width", "0.5");
                document.querySelectorAll(".attack-arrow").forEach(a => a.remove());
            });
        });
    }).catch(err => console.error("Fehler beim Initialisieren:", err));
});