// ============================================================================
// hover.js — nutzt normalizeCountry() aus iso_map.js
// ============================================================================

import { normalizeCountry } from "./iso_map.js";

document.addEventListener("DOMContentLoaded", () => {

    const obj = document.getElementById("mapObject");
    if (!obj) {
        console.error("❌ mapObject nicht gefunden");
        return;
    }

    let countryStats = {};

    // JSON mit Häufigkeiten laden
    const statsLoaded = fetch("/Prototyp_WAE_Website/data/countries_index.json")
        .then(res => res.json())
        .then(json => {
            countryStats = json;
            console.log("📊 Stats geladen:", countryStats);
        });

    obj.addEventListener("load", () => {

        const svg = obj.contentDocument.querySelector("svg");
        if (!svg) {
            console.error("❌ SVG im <object> nicht gefunden");
            return;
        }

        const countries = svg.querySelectorAll(".country");
        const tooltip = document.getElementById("tooltip");

        statsLoaded.then(() => {

            console.log("🌍 JSON + SVG bereit.");

            const maxValue = Math.max(...Object.values(countryStats));

            countries.forEach(c => {

                const rawId = c.getAttribute("id") || c.getAttribute("data-name");
                if (!rawId) return;

                // SVG-ID → Ländername normalisieren
                const countryName = normalizeCountry(rawId);

                // Stats holen
                const value = countryStats[countryName] ?? 0;

             

// HEATMAP (Optimierte Farbstufen-Verteilung)
// -----------------------------------------------------------------
if (value <= 0) {
    c.style.fill = "#ffffff";
} else {
    let logValue = Math.log(value + 1);
    let logMax = Math.log(maxValue + 1);
    let exponent = 0.5; 
    let t = Math.pow(logValue / logMax, exponent);
    t = Math.max(0, Math.min(1, t));

    let r, g, b;

    // Übergänge angepasst: Rot startet erst ab t > 0.6 deutlich
    if (t < 0.3) { 
        // Weiß zu Grün (0.0 - 0.3)
        r = Math.round(255 * (1 - t / 0.3)); 
        g = 255;
        b = Math.round(255 * (1 - t / 0.3));
    } else if (t < 0.6) { 
        // Grün zu Gelb (0.3 - 0.6)
        r = Math.round(255 * ((t - 0.3) / 0.3));
        g = 255;
        b = 0;
    } else if (t < 0.9) { 
        // Gelb zu Orange (0.6 - 0.9)
        r = 255;
        g = Math.round(255 * (1 - (t - 0.6) / 0.3));
        b = 0;
    } else { 
        // Hartes Rot erst ab 90% der gespreizten Skala
        r = 255;
        g = 0;
        b = 0;
    }

    c.style.fill = `rgb(${r},${g},${b})`;
}



     // HOVER
                // -----------------------------------------------------------------
                c.addEventListener("mouseenter", () => {
                    c.dataset.oldStroke = c.getAttribute("stroke") || "";
                    c.setAttribute("stroke", "#ff0000");
                    c.setAttribute("stroke-width", "1");

                    tooltip.innerHTML = `
                        <strong>${countryName}</strong><br>
                        Angriffe: ${value}
                    `;
                    tooltip.style.display = "block";
                });

                c.addEventListener("mousemove", (e) => {
                    const rect = obj.getBoundingClientRect();

                    const x = rect.left + e.clientX;
                    const y = rect.top + e.clientY;

                    tooltip.style.left = (x + 10) + "px";
                    tooltip.style.top = (y - 30) + "px";
                });


                c.addEventListener("mouseleave", () => {
                    tooltip.style.display = "none";
                    c.setAttribute("stroke", c.dataset.oldStroke);
                });

            });
        });

    });
});
