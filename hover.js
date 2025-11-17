document.addEventListener("DOMContentLoaded", () => {
    const obj = document.getElementById("mapObject");
    let countryStats = {};

    // ============================================================
    // 1) JSON LADEN (LÄNDERSTATISTIK)
    // ============================================================
    const statsLoaded = fetch("/Prototyp_WAE_Website/data/countries_index.json")
        .then(res => res.json())
        .then(json => {
            countryStats = json;
            console.log("📊 Länderstatistik geladen:", countryStats);
        });

    if (!obj) {
        console.error("❌ <object id='mapObject'> nicht gefunden");
        return;
    }

    // ============================================================
    // 2) SVG LADEN
    // ============================================================
    obj.addEventListener("load", () => {

        const svg = obj.contentDocument.querySelector("svg");

        if (!svg) {
            console.error("❌ SVG im <object> nicht gefunden (hover.js)");
            return;
        }

        const countries = svg.querySelectorAll(".country");
        console.log("🌍 Länder gefunden:", countries.length);

        // ============================================================
        // 3) WENN JSON UND SVG GELADEN → Heatmap + Tooltip aktivieren
        // ============================================================
        statsLoaded.then(() => {
            console.log("🔥 JSON + SVG bereit → Heatmap & Hover aktivieren");

            // ====================================================
            // TOOLTIP-Logik für Hover
            // ====================================================
            countries.forEach(country => {

                const tooltip = document.getElementById("tooltip");

                country.addEventListener("mouseenter", (e) => {

                    // Originalwerte speichern
                    country.dataset.originalStroke = country.getAttribute("stroke") || "";
                    country.dataset.originalStrokeWidth = country.getAttribute("stroke-width") || "";

                    // Hover-Styling
                    country.setAttribute("stroke", "#ff3333");
                    country.setAttribute("stroke-width", "1.0");
                    country.style.filter = "drop-shadow(0 0 8px #ff4444)";

                    // Landnamen holen
                    const countryName =
                        country.getAttribute("data-name") ||
                        country.getAttribute("id") ||
                        "Unknown";

                    // Statistik holen
                    const attacks = countryStats[countryName] ?? 0;

                    // Tooltip-Text setzen
                    tooltip.innerHTML = `
                        <strong>${countryName}</strong><br>
                        Angriffe: ${attacks}
                    `;
                    tooltip.style.display = "block";
                });

                country.addEventListener("mousemove", (e) => {
                    tooltip.style.left = (e.pageX + 15) + "px";
                    tooltip.style.top = (e.pageY + 15) + "px";
                });

                country.addEventListener("mouseleave", () => {
                    // Hover-Effekt entfernen
                    country.setAttribute("stroke", country.dataset.originalStroke);
                    country.setAttribute("stroke-width", country.dataset.originalStrokeWidth);
                    country.style.filter = "none";

                    // Tooltip ausblenden
                    tooltip.style.display = "none";
                });

            });

            // ====================================================
            // HEATMAP Färbung
            // ====================================================
            const max = Math.max(...Object.values(countryStats)); // dynamisch

            countries.forEach(c => {
                const name =
                    c.getAttribute("data-name") ||
                    c.getAttribute("id");

                const value = countryStats[name] ?? 0;

                // Intensität berechnen
                const intensity = Math.min(value / max, 1);

                // Rotton berechnen
                const red = Math.floor(255 * intensity);
                const green = 50;
                const blue = 50;

                // Heatmap setzen
                c.style.fill = `rgb(${red}, ${green}, ${blue})`;
            });
        });
    });
});
