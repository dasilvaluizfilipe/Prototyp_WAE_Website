async function loadFullTable() {
    const tableContainer = document.getElementById("all-data-table");

    try {
        console.log("🔍 Lade CSV aus:", "./data/cyber_incidents.csv");

        const response = await fetch("./data/cyber_incidents.csv");

        console.log("HTTP Status:", response.status, response.statusText);

        if (!response.ok) {
            tableContainer.innerHTML = `<p style="color:#f88;">CSV konnte nicht geladen werden (HTTP ${response.status}).</p>`;
            return;
        }

        const text = await response.text();
        console.log("📄 CSV Länge:", text.length);

        const lines = text
            .split("\n")
            .map(l => l.trim())
            .filter(l => l.length > 0);

        console.log("📌 Anzahl Zeilen:", lines.length);

        if (lines.length === 0) {
            tableContainer.innerHTML = `<p style="color:#ccc;">CSV ist leer.</p>`;
            return;
        }

        const header = parseCSVLine(lines[0]);
        console.log("🟥 Header:", header);

        let html = "<table class='datatable'><thead><tr>";
        for (let h of header) html += `<th>${h}</th>`;
        html += "</tr></thead><tbody>";

        for (let i = 1; i < lines.length; i++) {
            const cols = parseCSVLine(lines[i]);

            if (!cols || cols.length === 0) {
                console.warn("⚠ Leere Zeile bei i=", i, ":", lines[i]);
                continue;
            }

            html += "<tr>";
            for (let c of cols) html += `<td>${c}</td>`;
            html += "</tr>";
        }

        html += "</tbody></table>";
        tableContainer.innerHTML = html;

    } catch (err) {
        console.error("🔥 Fehler in loadFullTable():", err);
        tableContainer.innerHTML = `<p style="color:#f88;">Interner Fehler beim Laden der Tabelle.</p>`;
    }
}


function parseCSVLine(line) {
    if (!line) {
        console.error("❌ parseCSVLine bekam eine leere Zeile!");
        return [];
    }

    const result = [];
    let current = "";
    let insideQuotes = false;

    for (let c of line) {
        if (c === '"') insideQuotes = !insideQuotes;
        else if (c === "," && !insideQuotes) {
            result.push(current);
            current = "";
        } else {
            current += c;
        }
    }

    result.push(current);
    return result;
}

loadFullTable();
