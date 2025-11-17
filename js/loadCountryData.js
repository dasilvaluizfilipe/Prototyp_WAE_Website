// ============================================================================
// loadCountryData.js — gesamte Datei funktionsfähig inkl. Charts
// ============================================================================

import { normalizeCountry } from "./iso_map.js";

console.log("LOADCOUNTRYDATA: Datei geladen");

// ============================================================================
// Vergleichsfunktion für Länder
// ============================================================================
function matchCountry(value, target) {
    if (!value || !target) return false;
    return value.trim().toLowerCase() === target.trim().toLowerCase();
}

// ============================================================================
// CSV Parser
// ============================================================================
function parseCSVLine(line) {
    const result = [];
    let current = "";
    let insideQuotes = false;

    for (let c of line) {
        if (c === '"') insideQuotes = !insideQuotes;
        else if (c === "," && !insideQuotes) {
            result.push(current);
            current = "";
        } else current += c;
    }
    result.push(current);
    return result;
}

// ============================================================================
// CHART-RENDERING
// ============================================================================
function renderCharts(rows, header, countryName) {
    const idxStart = header.indexOf("start_date");
    const idxType = header.indexOf("incident_type");
    const idxInitC = header.indexOf("initiator_country");

    // ---------------------------------------------------------
    // 1) TIMELINE (Angriffe pro Jahr)
    // ---------------------------------------------------------
    let timeline = {};

    rows.forEach(row => {
        let date = row[idxStart];
        if (!date) return;
        let year = date.substring(0, 4);
        timeline[year] = (timeline[year] || 0) + 1;
    });

    new Chart(document.getElementById("chartTimeline"), {
        type: "line",
        data: {
            labels: Object.keys(timeline),
            datasets: [{
                label: "Angriffe pro Jahr",
                data: Object.values(timeline),
                borderWidth: 2,
                tension: 0.3
            }]
        }
    });

    // ---------------------------------------------------------
    // 2) TYPEN (incident_type)
    // ---------------------------------------------------------
    let types = {};

    rows.forEach(row => {
        let t = row[idxType] || "Unknown";
        types[t] = (types[t] || 0) + 1;
    });

    new Chart(document.getElementById("chartTypes"), {
        type: "bar",
        data: {
            labels: Object.keys(types),
            datasets: [{
                label: "Vorfallarten",
                data: Object.values(types),
                borderWidth: 1
            }]
        }
    });

    // ---------------------------------------------------------
    // 3) INITIATOREN (initiator_country)
    // ---------------------------------------------------------
    let initiators = {};

    rows.forEach(row => {
        let raw = row[idxInitC] || "Unknown";
        let name = normalizeCountry(raw);
        initiators[name] = (initiators[name] || 0) + 1;
    });

    new Chart(document.getElementById("chartInitiators"), {
        type: "bar",
        data: {
            labels: Object.keys(initiators),
            datasets: [{
                label: "Angriffe durch Initiatorländer",
                data: Object.values(initiators),
                borderWidth: 1
            }]
        }
    });
}

// ============================================================================
// MAIN-FUNKTION
// ============================================================================
async function loadCountryData(countryName) {

    const response = await fetch("/Prototyp_WAE_Website/data/cyber_incidents_light.csv");
    const text = await response.text();

    const lines = text.split("\n").filter(l => l.trim().length > 0);
    const header = parseCSVLine(lines[0]).map(h =>
        h.replace(/^"+|"+$/g, "").trim()
    );

    // Spalten, die angezeigt werden
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

    // Indexe
    const idxReceiverC = header.indexOf("receiver_country");
    const idxInitiatorC = header.indexOf("initiator_country");
    const idxStart = header.indexOf("start_date");
    const idxEnd = header.indexOf("end_date");

    let rows = [];

    // FILTER → nach Land
    for (let i = 1; i < lines.length; i++) {
        const cols = parseCSVLine(lines[i]);

        if (
            matchCountry(cols[idxReceiverC], countryName) ||
            matchCountry(cols[idxInitiatorC], countryName)
        ) {
            rows.push(cols);
        }
    }

    const container = document.getElementById("country-data");

    if (!rows.length) {
        container.innerHTML = `<p style="color:#888;">Keine Daten für ${countryName} gefunden.</p>`;
        return;
    }

    // SORTIEREN nach Datum
    function parseDate(str) {
        if (!str || str.trim() === "") return null;
        let d = new Date(str.trim());
        if (!isNaN(d)) return d;
        return null;
    }

    rows.sort((a, b) => {
        const da = parseDate(a[idxStart]) || parseDate(a[idxEnd]);
        const db = parseDate(b[idxStart]) || parseDate(b[idxEnd]);
        if (!da && !db) return 0;
        if (!da) return 1;
        if (!db) return -1;
        return db - da;
    });

    // TABELLE bauen
    let html = "<table class='datatable'><thead><tr>";
    for (let col of selectedColumns) {
        html += `<th>${TITLE_MAP[col]}</th>`;
    }
    html += "</tr></thead><tbody>";

    for (let row of rows) {

        const inName = row[header.indexOf("initiator_name")] || "-";
        const inCountry = row[header.indexOf("initiator_country")] || "-";

        const reName = row[header.indexOf("receiver_name")] || "-";
        const reCountry = row[header.indexOf("receiver_country")] || "-";

        const s = row[idxStart] || "";
        const e = row[idxEnd] || "";

        let timeCell = s;
        if (e && e !== s) timeCell = `${s} | ${e}`;

        html += "<tr>";

        for (let col of selectedColumns) {
            let cell = "";

            if (col === "initiator_combined") cell = `${inName} | ${inCountry}`;
            else if (col === "receiver_combined") cell = `${reName} | ${reCountry}`;
            else if (col === "date_combined") cell = timeCell;
            else cell = row[header.indexOf(col)] ?? "";

            html += `<td>${cell}</td>`;
        }

        html += "</tr>";
    }

    html += "</tbody></table>";
    container.innerHTML = `<div class="table-wrapper">${html}</div>`;

    // CHARTS jetzt rendern
    renderCharts(rows, header, countryName);
}

window.loadCountryData = loadCountryData;
