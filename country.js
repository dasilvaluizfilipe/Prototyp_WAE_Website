import { normalizeCountry } from "./iso_map.js";

document.addEventListener("DOMContentLoaded", () => {
    const obj = document.getElementById("mapObject");

    if (!obj) {
        console.error("❌ <object id='mapObject'> nicht gefunden");
        return;
    }

    obj.addEventListener("load", () => {
        const svg = obj.contentDocument.querySelector("svg");

        if (!svg) {
            console.error("❌ SVG im object nicht gefunden (country.js)");
            return;
        }

        console.log("📌 country.js SVG geladen");

        const countries = svg.querySelectorAll(".country");

        countries.forEach(country => {
            country.addEventListener("click", () => {

                // Raw-ID oder Name aus SVG holen
                const raw = country.getAttribute("title")
                    || country.id
                    || "unknown";

                console.log("📌 Klick in country.js → raw:", raw);

                // raw → korrekter URL-Code (Unterstriche statt Leerzeichen)
                const urlCode = raw
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "_")
                    .replace(/^_+|_+$/g, "");

                console.log("📌 erzeugter URL-Code:", urlCode);

                // Weiterleiten
                window.location.href =
                    `/Prototyp_WAE_Website/country/country_template.html?code=${encodeURIComponent(urlCode)}`;
            });
        });
    });
});
