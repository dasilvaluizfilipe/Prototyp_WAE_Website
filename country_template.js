import { normalizeCountry } from "./iso_map.js";
console.log("LOADCOUNTRYDATA: Datei geladen");

// ============================================================================
//  EXAKTES LÄNDERMATCHING MIT NORMALISIERUNG
// ============================================================================
function matchCountry(value, target) {
    if (!value || !target) return false;
    return normalizeCountry(value) === normalizeCountry(target);
}

// ============================================================================
//  CSV LADEN UND TABELLE + CHARTS RENDERN
// ============================================================================
async function loadCountryData(countryNameRaw) {

    const countryName = normalizeCountry(countryNameRaw);
    console.log("🔎 LOADCOUNTRYDATA →", countryName);

    const response = await fetch("/Prototyp_WAE_Website/data/cyber_incidents_light.csv");
    const text = await response.text();

    const lines = text.split("\n").filter(l => l.trim().length > 0);
    const header = parseCSVLine(lines[0]).map(h => h.replace(/^"+|"+$/g, "").trim());

    const rc = header.indexOf("receiver_country");
    const ic = header.indexOf("initiator_country");

    let rows = [];

    // ========================================================================
    //  ROW-FILTER
    // ========================================================================
    for (let i = 1; i < lines.length; i++) {
        const cols = parseCSVLine(lines[i]);

        const recv = normalizeCountry(cols[rc]);
        const init = normalizeCountry(cols[ic]);

        if (recv === countryName || init === countryName) {
            rows.push(cols);
        }
    }

    // HTML Container
    const container = document.getElementById("country-data");

    if (!rows.length) {
        container.innerHTML = `<p style="color:#888;">Keine Daten für ${countryName} gefunden.</p>`;
        return;
    }

    // ========================================================================
    //  TABELLE RENDERN
    // ========================================================================
    const selectedColumns = ["name", "description", "date_combined",
        "initiator_combined", "receiver_combined", "incident_type"];

    const TITLE_MAP = {
        name: "Name", description: "Beschreibung",
        date_combined: "Zeitraum",
        initiator_combined: "Initiator",
        receiver_combined: "Ziel",
        incident_type: "Typ"
    };

    const idxStart = header.indexOf("start_date");
    const idxEnd = header.indexOf("end_date");

    function parseDate(str) {
        const d = new Date(str);
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

    let html = "<table class='datatable'><thead><tr>";
    for (let col of selectedColumns) html += `<th>${TITLE_MAP[col]}</th>`;
    html += "</tr></thead><tbody>";

    for (let row of rows) {
        const inName = row[header.indexOf("initiator_name")] || "-";
        const inCountry = normalizeCountry(row[header.indexOf("initiator_country")] || "-");

        const reName = row[header.indexOf("receiver_name")] || "-";
        const reCountry = normalizeCountry(row[header.indexOf("receiver_country")] || "-");

        const s = row[idxStart] || "";
        const e = row[idxEnd] || "";
        const timeCell = (e && e !== s) ? `${s} | ${e}` : s;

        html += "<tr>";

        for (let col of selectedColumns) {
            let cell = "";
            if (col === "initiator_combined") cell = `${inName} | ${inCountry}`;
            else if (col === "receiver_combined") cell = `${reName} | ${reCountry}`;
            else if (col === "date_combined") cell = timeCell;
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

    // ========================================================================
    //  CHARTS ERZEUGEN
    // ========================================================================
    createTimelineChart(rows, header);
    createTypeChart(rows, header);
    createInitiatorChart(rows, header);
}


// ============================================================================
//  CHART 1 – Timeline (Angriffe pro Jahr)
// ============================================================================
function createTimelineChart(rows, header) {

    const idxStart = header.indexOf("start_date");
    const years = {};

    rows.forEach(r => {
        const year = (r[idxStart] || "").slice(0, 4);
        if (year.match(/^\d{4}$/)) {
            years[year] = (years[year] || 0) + 1;
        }
    });

    const labels = Object.keys(years).sort();
    const data = labels.map(y => years[y]);

    new Chart(document.getElementById("chartTimeline"), {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                label: "Angriffe",
                data: data,
                borderColor: "red",
                backgroundColor: "rgba(255,0,0,0.3)",
            }]
        }
    });
}


// ============================================================================
//  CHART 2 – Angriffsarten
// ============================================================================
function createTypeChart(rows, header) {

    const idx = header.indexOf("incident_type");
    const types = {};

    rows.forEach(r => {
        const t = r[idx] || "Unbekannt";
        types[t] = (types[t] || 0) + 1;
    });

    new Chart(document.getElementById("chartTypes"), {
        type: "bar",
        data: {
            labels: Object.keys(types),
            datasets: [{
                label: "Anzahl",
                data: Object.values(types),
                backgroundColor: "rgba(0,120,255,0.5)",
                borderColor: "#0078ff",
            }]
        }
    });
}


// ============================================================================
//  CHART 3 – Initiatoren
// ============================================================================
function createInitiatorChart(rows, header) {
    const idx = header.indexOf("initiator_country");
    const init = {};

    rows.forEach(r => {
        const c = normalizeCountry(r[idx] || "Unbekannt");
        init[c] = (init[c] || 0) + 1;
    });

    new Chart(document.getElementById("chartInitiators"), {
        type: "pie",
        data: {
            labels: Object.keys(init),
            datasets: [{
                data: Object.values(init),
                backgroundColor: [
                    "#ff4444", "#ff8844", "#ffd444", "#88ff44",
                    "#44ffdd", "#4477ff", "#aa44ff"
                ],
            }]
        }
    });
}


// ============================================================================
//  CSV-ZEILEN-PARSER
// ============================================================================
function parseCSVLine(line) {
    const result = [];
    let current = "";
    let insideQuotes = false;

    for (let c of line) {
        if (c === '"') insideQuotes = !insideQuotes;
        else if (c === "," && !insideQuotes) { result.push(current); current = ""; }
        else current += c;
    }
    result.push(current);
    return result;
}

window.loadCountryData = loadCountryData;
