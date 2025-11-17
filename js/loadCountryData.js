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
// ============================================================================
//  CHARTS GENERIEREN (Pie Charts + Timeline)
// ============================================================================

function renderCharts(rows, header) {

    const chartArea = document.getElementById("chart-area");
    chartArea.innerHTML = ""; // vorherige Charts löschen

    //----------------------------------------------------------------------
    // Hilfsfunktionen
    //----------------------------------------------------------------------
    function countByColumn(colName) {
        const idx = header.indexOf(colName);
        const map = {};
        for (let row of rows) {
            let v = (row[idx] || "Unbekannt").trim();
            if (!map[v]) map[v] = 0;
            map[v]++;
        }
        return map;
    }

    function generateCanvas(id) {
        const c = document.createElement("canvas");
        c.id = id;
        c.style.width = "100%";
        c.style.maxHeight = "300px";
        chartArea.appendChild(c);
        return c;
    }

    //----------------------------------------------------------------------
    // 1) PIE: Angriffsarten (incident_type)
    //----------------------------------------------------------------------
    const incidentCounts = countByColumn("incident_type");

    const canvas1 = generateCanvas("chart_incident_type");
    new Chart(canvas1, {
        type: "pie",
        data: {
            labels: Object.keys(incidentCounts),
            datasets: [{
                data: Object.values(incidentCounts),
                backgroundColor: Object.keys(incidentCounts).map((_, i) =>
                    `hsl(${(i * 40) % 360}, 70%, 60%)`
                )
            }]
        }
    });


    //----------------------------------------------------------------------
    // 2) PIE: Initiator-Länder (initiator_country)
    //----------------------------------------------------------------------
    const initCounts = countByColumn("initiator_country");

    const canvas2 = generateCanvas("chart_initiators");
    new Chart(canvas2, {
        type: "pie",
        data: {
            labels: Object.keys(initCounts),
            datasets: [{
                data: Object.values(initCounts),
                backgroundColor: Object.keys(initCounts).map((_, i) =>
                    `hsl(${(i * 40) % 360}, 70%, 60%)`
                )
            }]
        }
    });

    //----------------------------------------------------------------------
    // 3) LINE CHART: Timeline (start_date)
    //----------------------------------------------------------------------
    const idxStart = header.indexOf("start_date");
    const timeMap = {};

    for (let row of rows) {
        const raw = row[idxStart];
        if (!raw) continue;
        const year = raw.substring(0, 4);
        if (!timeMap[year]) timeMap[year] = 0;
        timeMap[year]++;
    }

    const canvas3 = generateCanvas("chart_timeline");
    new Chart(canvas3, {
        type: "line",
        data: {
            labels: Object.keys(timeMap),
            datasets: [{
                label: "Anzahl Vorfälle",
                data: Object.values(timeMap),
                tension: 0.3
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
    renderCharts(rows, header);
}

window.loadCountryData = loadCountryData;
