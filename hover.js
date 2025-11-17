document.addEventListener("DOMContentLoaded", () => {
    const obj = document.getElementById("mapObject");

    if (!obj) {
        console.error("❌ <object id='mapObject'> nicht gefunden");
        return;
    }

    obj.addEventListener("load", () => {
        const svg = obj.contentDocument.querySelector("svg");

        if (!svg) {
            console.error("❌ SVG im object nicht gefunden (hover.js)");
            return;
        }

        const countries = svg.querySelectorAll(".country");

        console.log("🌍 Länder gefunden (hover.js):", countries.length);

       countries.forEach(country => {

    country.addEventListener("mouseenter", () => {
        // Originalwerte speichern
        country.dataset.originalStroke = country.getAttribute("stroke") || "";
        country.dataset.originalStrokeWidth = country.getAttribute("stroke-width") || "";

        // Hover-Effekt (nur Rahmen + Glow)
        country.setAttribute("stroke", "#ff3333");
        country.setAttribute("stroke-width", "1.0");
        country.style.filter = "drop-shadow(0 0 8px #ff4444)";
    });

    country.addEventListener("mouseleave", () => {
        // Original wiederherstellen
        country.setAttribute("stroke", country.dataset.originalStroke);
        country.setAttribute("stroke-width", country.dataset.originalStrokeWidth);

        country.style.filter = "none";
    });

});
    });
});



