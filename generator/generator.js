const fs = require("fs");
const Papa = require("papaparse");

// CSV laden
const csv = fs.readFileSync("../data/cyber_incidents.csv", "utf8");
const parsed = Papa.parse(csv, { header: true }).data;

// Template laden
const template = fs.readFileSync("../templates/country_template.html", "utf8");

function safeFilename(str) {
    return str
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "")
        .slice(0, 40);
}

// Länder sammeln
const countries = new Set();

parsed.forEach(row => {
    const c = row.receiver_country || row.receiver_country_alpha_2_code;
    if (c && c.trim().length > 0) countries.add(c.trim());
});

// Sicherstellen, dass Output existiert
if (!fs.existsSync("../output")) {
    fs.mkdirSync("../output");
}

// Generieren
countries.forEach(country => {
    const fname = safeFilename(country);
    const outputPath = `../output/${fname}.html`;

    const html = template.replace(/{{COUNTRY}}/g, country);

    fs.writeFileSync(outputPath, html);
    console.log("✓ erzeugt:", fname + ".html");
});
