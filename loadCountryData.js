console.log("LOADCOUNTRYDATA: Datei geladen");

// ============================================================================
//  FLAGGEN (Emoji-Flags basierend auf Ländernamen)
// ============================================================================
const COUNTRY_FLAGS = {
    "USA": "🇺🇸",
    "United States": "🇺🇸",
    "Germany": "🇩🇪",
    "France": "🇫🇷",
    "United Kingdom": "🇬🇧",
    "Russia": "🇷🇺",
    "Ukraine": "🇺🇦",
    "China": "🇨🇳",
    "Japan": "🇯🇵",
    "South Korea": "🇰🇷",
    "North Korea": "🇰🇵",
    "Brazil": "🇧🇷",
    "Argentina": "🇦🇷",
    "India": "🇮🇳",
    "Iran": "🇮🇷",
    "Israel": "🇮🇱",
    "Turkey": "🇹🇷",
    "Australia": "🇦🇺",
    "Canada": "🇨🇦",
    "Mexico": "🇲🇽",
    "Poland": "🇵🇱",
    "Italy": "🇮🇹",
    "Spain": "🇪🇸",
    "Portugal": "🇵🇹",
    "Netherlands": "🇳🇱",
    "Sweden": "🇸🇪",
    "Norway": "🇳🇴",
    "Denmark": "🇩🇰",
    "Czechia": "🇨🇿",
    "Finland": "🇫🇮",
    "Belgium": "🇧🇪",
    "Switzerland": "🇨🇭",
    "Austria": "🇦🇹",
    "Greece": "🇬🇷",
    "Romania": "🇷🇴",
    "Bulgaria": "🇧🇬",
    "Hungary": "🇭🇺",
    "Serbia": "🇷🇸"
};

// Fallback für Länder, die nicht gemappt sind
function flagFor(country) {
    return COUNTRY_FLAGS[country] ?? "🏳️";
}

// ============================================================================
//  EXAKTES LÄNDERMATCHING
// ============================================================================
function matchCountry(value, target) {
    if (!value || !target) return false;
    return value.trim().toLowerCase() === target.trim().toLowerCase();
}

// ============================================================================
//  CSV LADEN UND TABELLE RENDERN
// ============================================================================
async function loadCountryData(countryName) {

    const response = await fetch("/Prototyp_WAE_Website/data/cyber_incidents_light.csv");
    const text = await response.text();

    const lines = text.split("\n").filter(l => l.trim().length > 0);

    const header = parseCSVLine(lines[0]).map(h =>
        h.replace(/^"+|"+$/g, "").trim()
    );

    // Nur diese Spalten anzeigen
    const selectedColumns = [
        "name",
        "description",
        "date_combined",
        "initiator_combined",
        "receiver_combined",
        "incident_type"
    ];

    const TITLE_MAP = {
        name: "Name",
        description: "Beschreibung",
        date_combined: "Zeitraum",
        initiator_combined: "Initiator",
        receiver_combined: "Ziel",
        incident_type: "Typ"
    };

    const rc = header.indexOf("receiver_country");
    const ic = header.indexOf("initiator_country");

    let rows = [];

    // Filtern nach Land (Initiator oder Ziel)
    for (let i = 1; i < lines.length; i++) {
        const cols = parseCSVLine(lines[i]);

        if (matchCountry(cols[rc], countryName) || matchCountry(cols[ic], countryName)) {
            rows.push(cols);
        }
    }

    // Wenn keine Treffer
    const container = document.getElementById("country-data");
    if (!rows.length) {
        container.innerHTML = `<p style="color:#888;">Keine Daten für ${countryName} gefunden.</p>`;
        return;
    }

    // Datum normalisieren
    function parseDate(str) {
        if (!str || str.trim() === "") return null;
        let d = new Date(str.trim());
        if (!isNaN(d)) return d;
        return null;
    }

    const idxStart = header.indexOf("start_date");
    const idxEnd   = header.indexOf("end_date");

    rows.sort((a, b) => {
        const da = parseDate(a[idxStart]) || parseDate(a[idxEnd]);
        const db = parseDate(b[idxStart]) || parseDate(b[idxEnd]);
        if (!da && !db) return 0;
        if (!da) return 1;
        if (!db) return -1;
        return db - da;
    });

    // Tabellen HTML bauen
    let html = "<table class='datatable'><thead><tr>";
    for (let col of selectedColumns) html += `<th>${TITLE_MAP[col]}</th>`;
    html += "</tr></thead><tbody>";

    for (let row of rows) {

        const inName = row[header.indexOf("initiator_name")] || "-";
        const inCountry = row[header.indexOf("initiator_country")] || "-";

        const reName = row[header.indexOf("receiver_name")] || "-";
        const reCountry = row[header.indexOf("receiver_country")] || "-";

        const s = row[idxStart] || "";
        const e = row[idxEnd] || "";

        // Zeitformat
        let timeCell = s;
        if (e && e !== s) timeCell = `${s} → ${e}`;

        html += "<tr>";

        for (let col of selectedColumns) {

            let cell = "";

            if (col === "initiator_combined") {
                cell = `${inName} | ${flagFor(inCountry)} ${inCountry}`;
            }

            else if (col === "receiver_combined") {
                cell = `${reName} | ${flagFor(reCountry)} ${reCountry}`;
            }

            else if (col === "date_combined") {
                cell = timeCell;
            }

            else {
                const idx = header.indexOf(col);
                cell = row[idx] ?? "";
            }

            html += `<td>${cell}</td>`;
        }

        html += "</tr>";
    }

    html += "</tbody></table>";
    container.innerHTML = `<div class="table-wrapper">${html}</div>`;
}

// ============================================================================
//  CSV-ZEILEN-PARSER
// ============================================================================
function parseCSVLine(line) {
    const result = [];
    let current = "";
    let insideQuotes = false;

    for (let c of line) {
        if (c === '"') {
            insideQuotes = !insideQuotes;
        } else if (c === "," && !insideQuotes) {
            result.push(current);
            current = "";
        } else {
            current += c;
        }
    }

    result.push(current);
    return result;
}

// Exportieren
window.loadCountryData = loadCountryData;
