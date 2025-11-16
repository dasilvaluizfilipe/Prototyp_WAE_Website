// ============================================================================
// URL-Parameter auslesen
// ============================================================================
function getCountryCode() {
    const params = new URLSearchParams(window.location.search);
    return params.get("code");
}

// ============================================================================
// CSV robust parsen
// ============================================================================
function parseCSVLine(line) {
    const res = [];
    let cur = "";
    let inside = false;

    for (let c of line) {
        if (c === '"') {
            inside = !inside;
        } else if (c === "," && !inside) {
            res.push(cur);
            cur = "";
        } else {
            cur += c;
        }
    }
    res.push(cur);
    return res;
}

// ============================================================================
// Helfer: Zeile bereinigen
// ============================================================================
function cleanRow(row) {
    return row.map(col =>
        col.trim()
           .replace(/\u0000/g, "")
           .replace(/\s+/g, " ")
    );
}

// ============================================================================
// Datum normalisieren
// ============================================================================
function normalizeDate(d) {
    if (!d || d.trim() === "") return null;

    const cleaned = d.trim().replace(/\u0000/g, "");

    let dt = new Date(cleaned);
    if (!isNaN(dt)) return dt;

    const patterns = [
        /(\d{2})\/(\d{2})\/(\d{4})/,
        /(\d{2})-(\d{2})-(\d{4})/,
        /(\d{4})\.(\d{2})\.(\d{2})/,
        /(\d{4})\/(\d{2})\/(\d{2})/
    ];

    for (const p of patterns) {
        const m = cleaned.match(p);
        if (m) return new Date(`${m[3]}-${m[2]}-${m[1]}`);
    }

    return null;
}

// ============================================================================
// Auto-Matching: flexible Ländererkennung
// ============================================================================
function matchesCountry(value, target) {
    if (!value || !target) return false;

    value  = value.toLowerCase();
    target = target.toLowerCase();

    return (
        value === target ||               // exact
        value.includes(target) ||         // Russian Federation → russia
        target.includes(value)            // ru → russia
    );
}

// ============================================================================
// HAUPTFUNKTION
// ============================================================================
async function loadCountry() {

    console.log("country_template.js: START");

    const countryCode = getCountryCode();
    if (!countryCode) {
        document.getElementById("country-data").innerHTML =
            "<p style='color:red'>Kein ?code= Parameter gefunden.</p>";
        return;
    }

    document.getElementById("country-title").innerText =
        "Cyber Incidents in " + countryCode;

    document.getElementById("country-description").innerText =
        `Diese Seite zeigt Cyber-Incidents für ${countryCode}.`;

    // CSV LADEN (fester GH-Pfad)
    const resp = await fetch("/Prototyp_WAE_Website/data/cyber_incidents.csv");
    const text = await resp.text();

    if (!text.trim()) {
        document.getElementById("country-data").innerHTML =
            "<p style='color:red'>CSV konnte nicht geladen werden.</p>";
        return;
    }

    const lines  = text.split("\n").filter(l => l.trim() !== "");
    const header = parseCSVLine(lines[0]);

    // Tabelle: relevante Spalten
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
        incident_type: "Typ",
        has_disruption: "Störung?"
    };

    const colIndex = selectedColumns.map(col => header.indexOf(col));

    // Länderfelder
    const rc  = header.indexOf("receiver_country");
    const ra2 = header.indexOf("receiver_country_alpha_2_code");
    const ic  = header.indexOf("initiator_country");
    const ia2 = header.indexOf("initiator_alpha_2");

    // FILTER
    let rows = [];

    for (let i = 1; i < lines.length; i++) {
        const cols = parseCSVLine(lines[i]);

        if (
            matchesCountry(cols[rc],  countryCode) ||
            matchesCountry(cols[ra2], countryCode) ||
            matchesCountry(cols[ic],  countryCode) ||
            matchesCountry(cols[ia2], countryCode)
        ) {
            rows.push(cols);
        }
    }

    if (!rows.length) {
        document.getElementById("country-data").innerHTML =
            `<p style="color:#ccc;">Keine Daten für ${countryCode} gefunden.</p>`;
        return;
    }

    // SORTIERUNG
    rows = rows.map(cleanRow);

    const startIndex = header.indexOf("start_date");
    const endIndex   = header.indexOf("end_date");

    rows.sort((a, b) => {
        const da = normalizeDate(a[startIndex]) || normalizeDate(a[endIndex]);
        const db = normalizeDate(b[startIndex]) || normalizeDate(b[endIndex]);

        if (!da && !db) return 0;
        if (!da) return 1;
        if (!db) return -1;

        return db - da;
    });

    // TABELLE AUFBAUEN
    let html = "<table class='datatable'><thead><tr>";

    for (let col of selectedColumns) {
        html += `<th>${TITLE_MAP[col]}</th>`;
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

    document.getElementById("country-data").innerHTML =
        `<div class="table-wrapper">${html}</div>`;

    console.log("country_template.js: Tabelle generiert.");
}

// ============================================================================
// START
// ============================================================================
loadCountry();
