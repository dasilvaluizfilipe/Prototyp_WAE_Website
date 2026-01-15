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

             

// HEATMAP (Gelb -> Orange -> Rot)
// -----------------------------------------------------------------
if (value <= 0) {
    c.style.fill = "#ffffff"; // Weiß bei 0
} else {
    let logValue = Math.log(value + 1);
    let logMax = Math.log(maxValue + 1);
    let exponent = 0.5; 
    let t = Math.pow(logValue / logMax, exponent);
    t = Math.max(0, Math.min(1, t));

    let r, g, b;

    if (t < 0.33) {
        // Stufe 1: Weiß zu Gelb (0.0 - 0.33)
        // Blauanteil sinkt, damit aus Weiß Gelb wird
        r = 255;
        g = 255;
        b = Math.round(255 * (1 - t / 0.33));
    } else if (t < 0.66) {
        // Stufe 2: Gelb zu Orange (0.33 - 0.66)
        // Grünanteil sinkt leicht für Orange-Töne
        r = 255;
        g = Math.round(255 * (1 - (t - 0.33) * 0.8)); // g sinkt bis ca. 185
        b = 0;
    } else if (t < 0.9) {
        // Stufe 3: Orange zu hellem Rot (0.66 - 0.9)
        // Grünanteil sinkt weiter stark
        r = 255;
        g = Math.round(185 * (1 - (t - 0.66) / 0.24));
        b = 0;
    } else {
        // Stufe 4: Volles Rot (0.9 - 1.0)
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
