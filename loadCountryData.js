console.log("LOADCOUNTRYDATA: Datei geladen");

// ============================================================================
//  FLEXIBLES LÄNDERMATCHING (WICHTIG!)
// ============================================================================
function matchCountry(value, target) {
    if (!value || !target) return false;

    value = value.toLowerCase().trim();
    target = target.toLowerCase().trim();

    return (
        value === target ||               // exakt
        value.includes(target) ||         // "Russian Federation" enthält "russia"
        target.includes(value)            // "ru" passt zu "russia"
    );
}

// ============================================================================
//  HAUPTFUNKTION
// ============================================================================
async function loadCountryData(countryName) {

    console.log("LOADCOUNTRYDATA: startet für:", countryName);

    // CSV laden
    const response = await fetch("/Prototyp_WAE_Website/data/cyber_incidents.csv");
    const text = await response.text();

    const lines = text.split("\n").filter(l => l.trim().length > 0);

    // HEADER ENTQUOTEN (KRITISCHER FIX!)
    let header = parseCSVLine(lines[0]).map(h =>
        h.replace(/^"+|"+$/g, "").trim()
    );

    console.log("HEADER:", header);

    // ----------------------------
    // Spalten, die angezeigt werden
    // ----------------------------
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

    const colIndex = selectedColumns.map(col => header.indexOf(col));

    // ----------------------------
    // Länderspalten
    // ----------------------------
    const rc  = header.indexOf("receiver_country");
    const ra2 = header.indexOf("receiver_country_alpha_2_code");
    const ic  = header.indexOf("initiator_country");
    const ia2 = header.indexOf("initiator_alpha_2");

    console.log("INDEX CHECK:", { rc, ra2, ic, ia2 });

    let rows = [];

    // ========================================================================
    //  DATEN MATCHEN: JETZT MIT FLEXIBLER SUCHE
    // ========================================================================
    for (let i = 1; i < lines.length; i++) {
        const cols = parseCSVLine(lines[i]);

        if (
            matchCountry(cols[rc],  countryName) ||
            matchCountry(cols[ra2], countryName) ||
            matchCountry(cols[ic],  countryName) ||
            matchCountry(cols[ia2], countryName)
        ) {
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

            return db - da;
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
//  CSV Parser
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

// EXPORTIEREN FÜR country_template.js
window.loadCountryData = loadCountryData;


/* async function loadCountryData(countryName) {

    // CSV laden
    const response = await fetch("../data/cyber_incidents.csv");
    const text = await response.text();

    const lines = text.split("\n").filter(l => l.trim().length > 0);
    const header = parseCSVLine(lines[0]);

    // Top-10 Spalten
    const selectedColumns = [
        "incident_id",
        "name",
        "description",
        "start_date",
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
    initiator_name: "Initiator",
    initiator_country: "Initiator-Land",
    receiver_name: "Ziel",
    receiver_country: "Ziel-Land",
    incident_type: "Typ des Zwischenfalls",
    has_disruption: "Störung verursacht?"
};

    // Spaltenindexe
    const colIndex = selectedColumns.map(col => header.indexOf(col));

    // Mögliche Namensfelder (weil CSV nicht einheitlich ist)
    const receiverCountryIndex = header.indexOf("receiver_country");
    const receiverCodeIndex     = header.indexOf("receiver_country_alpha_2_code");
    const initiatorCountryIndex = header.indexOf("initiator_country");
    const initiatorCodeIndex    = header.indexOf("initiator_alpha_2");

    // Filter für das Land
    let rows = [];
    for (let i = 1; i < lines.length; i++) {
        const cols = parseCSVLine(lines[i]);

        if (
            cols[receiverCountryIndex] === countryName ||
            cols[initiatorCountryIndex] === countryName ||
            cols[receiverCodeIndex] === countryName ||
            cols[initiatorCodeIndex] === countryName
        ) {
            rows.push(cols);
        }
    }

    const container = document.getElementById("country-data");

    if (!rows.length) {
        container.innerHTML = `<p style="color:#ccc;">Keine Daten für ${countryName} gefunden.</p>`;
        return;
    }

    // Tabelle bauen
let html = "<table class='datatable'><thead><tr>";

for (let col of selectedColumns) {
    html += `<th>${TITLE_MAP[col] || col}</th>`;
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


    // WICHTIG: Wrapper verhindert abgeschnittene Tabelle
    container.innerHTML = `<div class="table-wrapper">${html}</div>`;
}


// CSV Parser
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

*/




/*async function loadCountryData(countryName) {

    // CSV laden
    const response = await fetch("../data/cyber_incidents.csv"); // <-- anpassen!
    const text = await response.text();

    // CSV korrekt splitten
    // Achtung: manche Felder enthalten Kommas!
    // ==> wir müssen nach Kommas splitten, die NICHT in Anführungszeichen stehen
    const lines = text.split("\n").filter(l => l.trim().length > 0);

    // Header parsen
    const header = parseCSVLine(lines[0]);

    // relevante Spalten finden
    const idxCountryName = header.indexOf("receiver_country");
    const idxCountryCode = header.indexOf("receiver_country_alpha_2_code");

    let resultRows = [];

    for (let i = 1; i < lines.length; i++) {
        const cols = parseCSVLine(lines[i]);

        // match nach Name ODER Code
        if (cols[idxCountryName] === countryName || cols[idxCountryCode] === countryName) {
            resultRows.push(cols);
        }
    }

    // Container zum Einfügen
    const output = document.getElementById("country-data");

    if (!output) {
        console.error("Element #country-data fehlt!");
        return;
    }

    // Tabelle generieren
    let html = "<table class='datatable'><thead><tr>";

    for (const h of header) {
        html += `<th>${h}</th>`;
    }
    html += "</tr></thead><tbody>";

    for (let row of resultRows) {
        html += "<tr>";
        for (let cell of row) {
            html += `<td>${cell}</td>`;
        }
        html += "</tr>";
    }

    html += "</tbody></table>";
    output.innerHTML = `<div class="table-wrapper">${html}</div>`;
}


// Hilfsfunktion, die CSV-Zeilen sauber spaltet
// Sie berücksichtigt Kommas *innerhalb* von Anführungszeichen
function parseCSVLine(line) {
    const result = [];
    let current = "";
    let insideQuotes = false;

    for (let c of line) {
        if (c === '"' ) {
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


























/* async function loadCountryData(countryName) {
    const response = await fetch("cve_test.csv");
    const text = await response.text();

    const lines = text.split("\n").map(l => l.trim()).filter(l => l.length > 0);
    const header = lines[0].split(";");

    let rows = [];

    for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(";");
        if (cols[0] === countryName) {
            rows.push(cols);
        }
    }

    // Ausgabe-Container finden
    const output = document.getElementById("country-data");

    if (!output) {
        console.error("Element #country-data fehlt!");
        return;
    }

    // Tabelle erstellen
    let html = "<table class='datatable'><thead><tr>";

    for (let h of header) {
        html += `<th>${h}</th>`;
    }
    html += "</tr></thead><tbody>";

    for (let row of rows) {
        html += "<tr>";
        for (let cell of row) {
            html += `<td>${cell}</td>`;
        }
        html += "</tr>";
    }

    html += "</tbody></table>";

    output.innerHTML = html;
}
    */
