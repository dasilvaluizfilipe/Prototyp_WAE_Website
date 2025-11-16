const ROWS_PER_PAGE = 50;
let allLines = [];
let header = [];
let currentPage = 1;

async function loadFullTable() {
    const container = document.getElementById("all-data-table");
    container.innerHTML = "Lade Daten…";

    try {
        // WICHTIG: absoluter Pfad für GitHub Pages!!
        const response = await fetch("/Prototyp_WAE_Website/data/cyber_incidents_light.csv");
        const text = await response.text();

        allLines = text.split("\n").filter(l => l.trim().length > 0);
        header = parseCSVLine(allLines[0]);

                // -----------------------------------------
        // CSV-Bereinigung + Datumssortierung (Variante C)
        // -----------------------------------------

        function cleanRow(row) {
            return row.map(col =>
                col.trim()
                   .replace(/\u0000/g, '')
                   .replace(/\s+/g, ' ')
            );
        }

        function normalizeDate(dateStr) {
            if (!dateStr || dateStr.trim() === "") return null;

            const cleaned = dateStr.trim().replace(/\u0000/g, "");

            // ISO first
            let d = new Date(cleaned);
            if (!isNaN(d)) return d;

            // fallback patterns
            const patterns = [
                /(\d{2})\/(\d{2})\/(\d{4})/,      // DD/MM/YYYY
                /(\d{2})-(\d{2})-(\d{4})/,        // DD-MM-YYYY
                /(\d{4})\.(\d{2})\.(\d{2})/,      // YYYY.MM.DD
                /(\d{4})\/(\d{2})\/(\d{2})/       // YYYY/MM/DD
            ];

            for (const p of patterns) {
                const m = cleaned.match(p);
                if (m) {
                    return new Date(`${m[3]}-${m[2]}-${m[1]}`);
                }
            }

            return null;
        }

        function extractRelevantDate(cols, startIndex, endIndex) {
            const startD = normalizeDate(cols[startIndex]);
            if (startD) return startD;

            const endD = normalizeDate(cols[endIndex]);
            if (endD) return endD;

            return null;
        }

        function sortByIncidentDate(lines, header) {
            const startIndex = header.indexOf("start_date");
            const endIndex   = header.indexOf("end_date");

            // Headline bleibt oben → nur Zeilen 1…N sortieren
            const bodyLines = lines.slice(1);

            bodyLines.sort((lineA, lineB) => {
                const colsA = cleanRow(parseCSVLine(lineA));
                const colsB = cleanRow(parseCSVLine(lineB));

                const da = extractRelevantDate(colsA, startIndex, endIndex);
                const db = extractRelevantDate(colsB, startIndex, endIndex);

                if (!da && !db) return 0;
                if (!da) return 1;
                if (!db) return -1;

                return db - da; // neueste zuerst
            });

            // neue Reihenfolge zurückschreiben
            return [lines[0], ...bodyLines];
        }

        // Jetzt: globale CSV sortieren
        allLines = sortByIncidentDate(allLines, header);


        renderPage(1);

    } catch (err) {
        container.innerHTML = `<p style="color:red">Fehler beim Laden der CSV: ${err}</p>`;
    }
}

function renderPage(page) {
    currentPage = page;

    const container = document.getElementById("all-data-table");
    const start = 1 + (page - 1) * ROWS_PER_PAGE;
    const end = Math.min(start + ROWS_PER_PAGE, allLines.length);

    let html = `
        <div class="table-wrapper">
        <table class="datatable">
            <thead><tr>
    `;

    for (let h of header) html += `<th>${h}</th>`;
    html += `</tr></thead><tbody>`;

    for (let i = start; i < end; i++) {
        const cols = parseCSVLine(allLines[i]);
        html += "<tr>";
        for (let c of cols) html += `<td>${c}</td>`;
        html += "</tr>";
    }

    html += "</tbody></table></div>";

    const totalPages = Math.ceil((allLines.length - 1) / ROWS_PER_PAGE);

    html += `
        <div class="pagination" style="margin-top: 20px; text-align: center;">
            ${page > 1 ? `<button onclick="renderPage(${page - 1})">← Zurück</button>` : ""}
            <span style="margin:0 15px; color:#ccc;">Seite ${page} / ${totalPages}</span>
            ${page < totalPages ? `<button onclick="renderPage(${page + 1})">Weiter →</button>` : ""}
        </div>
    `;

    container.innerHTML = html;
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

loadFullTable();
