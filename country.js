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
        // 1. Title-Attribut lesen (nicht die JS-Eigenschaft)
        const rawTitle = country.getAttribute("title");
        // 2. Fallback: ID verwenden, falls kein title existiert
        const base = rawTitle || country.id || "unknown";

        // 3. Dateinamen-sicher machen: nur Buchstaben/Zahlen, Rest zu _
        const safeName = base
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "_")
            .replace(/^_+|_+$/g, ""); // führende/trailing _ weg

        console.log("📌 Klick in country.js:", base, "→", safeName);

        window.location.href = `./output/${safeName}.html`;
    });
});
    });
});
