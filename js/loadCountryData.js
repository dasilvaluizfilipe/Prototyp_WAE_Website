// ============================================================================
// loadCountryData.js — vollständige Version inkl. bereinigter Pie-Charts
// ============================================================================

import { normalizeCountry } from "./iso_map.js";

console.log("LOADCOUNTRYDATA: Datei geladen");

// ============================================================================
// Hilfsfunktionen
// ============================================================================

function matchCountry(value, target) {
    if (!value || !target) return false;
    return value.trim().toLowerCase() === target.trim().toLowerCase();
}

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
// INCIDENT-TYPE NORMALISIERUNG
// ============================================================================

const INCIDENT_NORMALIZATION = [
    { match: /ransomware/i, norm: "Ransomware" },
    { match: /phishing|social engineering/i, norm: "Phishing" },
    { match: /ddos/i, norm: "DDoS" },
    { match: /malware|virus|trojan/i, norm: "Malware" },
    { match: /data theft|datatheft|theft/i, norm: "Datendiebstahl" },
    { match: /espionage|spy/i, norm: "Spionage" },
    { match: /sabotage|infrastructure/i, norm: "Sabotage" },
    { match: /supply|dependency/i, norm: "Lieferkettenangriff" },
    { match: /vulnerability|zero\-?day/i, norm: "Zero-Day Exploit" }
];

function cleanIncidentType(raw) {
    if (!raw) return "Unbekannt";
    const t = raw.trim();

    for (let rule of INCIDENT_NORMALIZATION) {
        if (rule.match.test(t)) return rule.norm;
    }
    return t; // fallback → Original
}

// ============================================================================
// CHARTS
// ============================================================================

function renderCharts(rows, header) {

    const chartArea = document.getElementById("chart-area");
    chartArea.innerHTML = "";

    function generateCanvas(id) {
        const c = document.createElement("canvas");
        c.id = id;
        c.style.width = "100%";
        c.style.maxHeight = "300px";
        chartArea.appendChild(c);
        return c;
    }

    function countCustomIncidentTypes() {
        const idx = header.indexOf("incident_type");
        const map = {};
        for (let r of rows) {
            let clean = cleanIncidentType(r[idx]);
            map[clean] = (map[clean] || 0) + 1;
        }
        return map;
    }

    function countByColumn(col) {
        const idx = header.indexOf(col);
        const map = {};
        for (let r of rows) {
            let v = r[idx] || "Unbekannt";
            v = v.trim();
            map[v] = (map[v] || 0) + 1;
        }
        return map;
    }

    // ------------------------------
    // PIE 1: Bereinigte Angriffsarten
    // ------------------------------
    const incidentCounts = countCustomIncidentTypes();
    const c1 = generateCanvas("chart_incident_type");

    new Chart(c1, {
        type: "pie",
        data: {
            labels: Object.keys(incidentCounts),
            datasets: [{
                data: Object.values(incidentCounts),
                backgroundColor: Object.keys(incidentCounts).map((_, i) =>
                    `hsl(${(i * 50) % 360}, 70%, 55%)`
                )
            }]
        }
    });

    // ------------------------------
    // PIE 2: Initiatoren (nach Land)
    // ------------------------------
    const initCounts = countByColumn("initiator_country");
    const c2 = generateCanvas("chart_initiators");

    new Chart(c2, {
        type: "pie",
        data: {
            labels: Object.keys(initCounts),
            datasets: [{
                data: Object.values(initCounts),
                backgroundColor: Object.keys(initCounts).map((_, i) =>
                    `hsl(${(i * 40) % 360}, 70%, 55%)`
                )
            }]
        }
    });

    // ------------------------------
    // LINE: Timeline der Attacken
    // ------------------------------
    const idxStart = header.indexOf("start_date");
    const timeline = {};

    for (let r of rows) {
        const d = r[idxStart];
        if (!d) continue;
        const year = d.substring(0, 4);
        timeline[year] = (timeline[year] || 0) + 1;
    }

    const c3 = generateCanvas("chart_timeline");
    new Chart(c3, {
        type: "line",
        data: {
            labels: Object.keys(timeline),
            datasets: [{
                label: "Angriffe pro Jahr",
                data: Object.values(timeline),
                tension: 0.3
            }]
        }
    });
}

// ============================================================================
// MAIN
// ============================================================================

async function loadCountryData(countryName) {

    const response = await fetch("/Prototyp_WAE_Website/data/cyber_incidents_light.csv");
    const text = await response.text();

    const lines = text.split("\n").filter(l => l.trim().length > 0);
    const header = parseCSVLine(lines[0]).map(h =>
        h.replace(/^"+|"+$/g, "").trim()
    );

    const idxReceiver = header.indexOf("receiver_country");
    const idxInitiator = header.indexOf("initiator_country");
    const idxStart = header.indexOf("start_date");
    const idxEnd = header.indexOf("end_date");

    const rows = [];

    for (let i = 1; i < lines.length; i++) {
        const cols = parseCSVLine(lines[i]);

        if (
            matchCountry(cols[idxReceiver], countryName) ||
            matchCountry(cols[idxInitiator], countryName)
        ) {
            rows.push(cols);
        }
    }

    const container = document.getElementById("country-data");

    if (!rows.length) {
        container.innerHTML = `<p style="color:#888;">Keine Daten für ${countryName}.</p>`;
        return;
    }

    // --------------------------
    // Sortieren nach Datum
    // --------------------------
    function parseDate(raw) {
        if (!raw || !raw.trim()) return null;
        const d = new Date(raw.trim());
        return isNaN(d) ? null : d;
    }

    rows.sort((a, b) => {
        const da = parseDate(a[idxStart]) || parseDate(a[idxEnd]);
        const db = parseDate(b[idxStart]) || parseDate(b[idxEnd]);
        if (!da && !db) return 0;
        if (!da) return 1;
        if (!db) return -1;
        return db - da;
    });

    // --------------------------
    // Tabelle rendern
    // --------------------------
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
        const combinedDate = (e && e !== s) ? `${s} | ${e}` : s;

        html += "<tr>";

        for (let col of selectedColumns) {

            if (col === "initiator_combined")
                html += `<td>${inName} | ${inCountry}</td>`;

            else if (col === "receiver_combined")
                html += `<td>${reName} | ${reCountry}</td>`;

            else if (col === "date_combined")
                html += `<td>${combinedDate}</td>`;

            else if (col === "incident_type")
                html += `<td>${cleanIncidentType(row[header.indexOf("incident_type")])}</td>`;

            else
                html += `<td>${row[header.indexOf(col)] || ""}</td>`;
        }

        html += "</tr>";
    }

    html += "</tbody></table>";
    container.innerHTML = `<div class="table-wrapper">${html}</div>`;

    // Charts generieren
    renderCharts(rows, header);
}

window.loadCountryData = loadCountryData;
