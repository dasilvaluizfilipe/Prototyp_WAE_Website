console.log("LOADCOUNTRYDATA: Datei geladen");

// ============================================================================
//  EXAKTES LÄNDERMATCHING (ISO-normalisiert – fuzzy NICHT mehr nötig!)
// ============================================================================
function matchCountry(value, target) {
    if (!value || !target) return false;
    return value.trim().toLowerCase() === target.trim().toLowerCase();
}

// ============================================================================
//  HAUPTFUNKTION: Lädt CSV + Filter nach Land + Rendert Tabelle
// ============================================================================
async function loadCountryData(countryName) {

    console.log("LOADCOUNTRYDATA läuft für:", countryName);

    // CSV laden (NUR light.csv!)
    const response = await fetch("/Prototyp_WAE_Website/data/cyber_incidents_light.csv");
    const text = await response.text();

    // Zeilen extrahieren
    const lines = text.split("\n").filter(l => l.trim().length > 0);

    // Header parsen
    let header = parseCSVLine(lines[0]).map(h =>
        h.replace(/^"+|"+$/g, "").trim()
    );

    console.log("HEADER:", header);

    // Relevante Spalten für Anzeige
    const selectedColumns = [
        "incident_id",
        "name",
        "description",
        "start_date",
        "end_date",
        "initiator_name",
        "initiator_country",
        "receiver_name",
        "receiver_country",
        "incident_type",
        "has_disruption"
    ];

    const TITLE_MAP = {
        incident_id: "Incident ID",
        name: "Name",
        description: "Beschreibung",
        start_date: "Startdatum",
        end_date: "Enddatum",
        initiator_name: "Initiator",
        initiator_country: "Initiator-Land",
        receiver_name: "Ziel",
        receiver_country: "Ziel-Land",
        incident_type: "Incident-Typ",
        has_disruption: "Störung?"
    };

    // Indexe der Tabellen-Spalten
    const colIndex = selectedColumns.map(col => header.indexOf(col));

    // Länder-Spalten (NUR Name, keine Codes)
    const rc = header.indexOf("receiver_country");
    const ic = header.indexOf("initiator_country");

    let rows = [];

    // ========================================================================
    //  FILTERING: nur Einträge dieses Landes
    // ========================================================================
    for (let i = 1; i < lines.length; i++) {
        const cols = parseCSVLine(lines[i]);

        if (matchCountry(cols[rc], countryName) || matchCountry(cols[ic], countryName)) {
            rows.push(cols);
        }
    }

    console.log("MATCHING ROWS:", rows.length);

    const container = document.getElementById("country-data");

    if (!rows.length) {
        container.innerHTML = `<p style="color:#ccc;">Keine Daten für ${countryName} gefunden.</p>`;
        return;
    }

    // ========================================================================
    //  BEREINIGUNG + DATUMSORTIERUNG
    // ========================================================================
    function cleanRow(row) {
        return row.map(col =>
            col.trim()
               .replace(/\u0000/g, "")
               .replace(/\s+/g, " ")
        );
    }

    function normalizeDate(dateStr) {
        if (!dateStr || dateStr.trim() === "") return null;

        const cleaned = dateStr.trim().replace(/\u0000/g, "");

        let d = new Date(cleaned);
        if (!isNaN(d)) return d;

        const patterns = [
            /(\d{2})\/(\d{2})\/(\d{4})/,
            /(\d{2})-(\d{2})-(\d{4})/,
            /(\d{4})\.(\d{2})\.(\d{2})/,
            /(\d{4})\/(\d{2})\/(\d{2})/
        ];

        for (const p of patterns) {
            const m = cleaned.match(p);
            if (m) {
                return new Date(`${m[3]}-${m[2]}-${m[1]}`);
            }
        }

        return null;
    }

    function extractRelevantDate(row, startIndex, endIndex) {
        return normalizeDate(row[startIndex]) || normalizeDate(row[endIndex]) || null;
    }

    function sortByIncidentDate(rows, startIndex, endIndex) {
        rows.sort((a, b) => {
            const da = extractRelevantDate(a, startIndex, endIndex);
            const db = extractRelevantDate(b, startIndex, endIndex);

            if (!da && !db) return 0;
            if (!da) return 1;
            if (!db) return -1;

            return db - da; // Neueste zuerst
        });
    }

    rows = rows.map(cleanRow);

    const startIndex = header.indexOf("start_date");
    const endIndex   = header.indexOf("end_date");

    sortByIncidentDate(rows, startIndex, endIndex);

    // ========================================================================
    //  TABELLE RENDERN
    // ========================================================================
    let html = "<table class='datatable'><thead><tr>";

    for (let col of selectedColumns) {
        const title = TITLE_MAP[col] || col;
        html += `<th>${title}</th>`;
    }

    html += "</tr></thead><tbody>";

    for (let row of rows) {
        html += "<tr>";
        for (let idx of colIndex) {
            html += `<td>${row[idx] ?? ""}</td>`;
        }
        html += "</tr>";
    }

    html += "</tbody></table>";

    container.innerHTML = `<div class="table-wrapper">${html}</div>`;
}


// ============================================================================
// CSV-Zeilen-Parser (unterstützt Kommas in Anführungszeichen)
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

// Exportieren für country_template.js
window.loadCountryData = loadCountryData;

