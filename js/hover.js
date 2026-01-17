import { normalizeCountry } from "./iso_map.js";

document.addEventListener("DOMContentLoaded", () => {
    // 1. Direktzugriff auf die Inline-SVG
    const svg = document.getElementById("mapObject");
    const tooltip = document.getElementById("tooltip");

    if (!svg) {
        console.error("❌ mapObject (SVG) nicht im HTML gefunden");
        return;
    }

    let countryStats = {};

    // 2. JSON laden
    const statsLoaded = fetch("../data/countries_index.json")
        .then(res => res.json())
        .then(json => {
            countryStats = json;
            console.log("📊 Stats geladen:", countryStats);
            return json;
        })
        .catch(err => console.error("❌ Fehler beim Laden der JSON:", err));

    // 3. Logik ausführen, sobald Stats da sind
    statsLoaded.then(() => {
        const countries = svg.querySelectorAll(".country");
        const values = Object.values(countryStats);
        const maxValue = values.length > 0 ? Math.max(...values) : 0;

        console.log("🌍 Karte wird initialisiert...");

        countries.forEach(c => {
            const rawId = c.getAttribute("id") || c.getAttribute("data-name");
            if (!rawId) return;

            const countryName = normalizeCountry(rawId);
            const value = countryStats[countryName] ?? 0;

            // HEATMAP FARBEN
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

            // EVENT LISTENERS
            c.addEventListener("mouseenter", () => {
                c.dataset.oldStroke = c.getAttribute("stroke") || "#000";
                c.setAttribute("stroke", "#ff0000");
                c.setAttribute("stroke-width", "1");

                tooltip.innerHTML = `<strong>${countryName}</strong><br>Angriffe: ${value}`;
                tooltip.style.display = "block";
            });

            c.addEventListener("mousemove", (e) => {
                // Nutzt pageX/Y für absolute Positionierung auf der Seite
                tooltip.style.left = (e.pageX + 15) + "px";
                tooltip.style.top = (e.pageY - 40) + "px";
            });

            c.addEventListener("mouseleave", () => {
                tooltip.style.display = "none";
                c.setAttribute("stroke", c.dataset.oldStroke);
                c.setAttribute("stroke-width", "0.5");
            });

            c.addEventListener("click", () => {
                console.log("Land geklickt:", rawId, "Normalisiert:", countryName);
            });
        });
    });
});
