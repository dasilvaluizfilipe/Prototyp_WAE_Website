import { normalizeCountry } from "./iso_map.js";

document.addEventListener("DOMContentLoaded", () => {
    // 1. Direktzugriff auf die Inline-SVG via ID
    const svg = document.getElementById("mapObject");

    if (!svg) {
        console.error("❌ SVG mit ID 'mapObject' nicht im HTML gefunden (country.js)");
        return;
    }

    console.log("📌 country.js: Inline-SVG bereit");

    // 2. Länder-Pfade direkt selektieren
    const countries = svg.querySelectorAll(".country");

    countries.forEach(country => {
        country.addEventListener("click", () => {

            // Raw-ID oder Name aus SVG holen
            const raw = country.getAttribute("title")
                || country.id
                || "unknown";

            console.log("📌 Klick in country.js → raw:", raw);

            // raw → korrekter URL-Code
            const urlCode = raw
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "_")
                .replace(/^_+|_+$/g, "");

            console.log("📌 erzeugter URL-Code:", urlCode);

            // Weiterleiten
            window.location.href =
                `/Prototyp_WAE_Website/templates/country_template.html?code=${encodeURIComponent(urlCode)}`;
        });
    });
});
