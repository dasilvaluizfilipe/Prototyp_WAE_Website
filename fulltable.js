const ROWS_PER_PAGE = 50;
let allLines = [];
let header = [];
let currentPage = 1;

async function loadFullTable() {
    const container = document.getElementById("all-data-table");
    container.innerHTML = "Lade Daten…";

    try {
        // WICHTIG: absoluter Pfad für GitHub Pages!!
        const response = await fetch("../data/cyber_incidents.csv");
        const text = await response.text();

        allLines = text.split("\n").filter(l => l.trim().length > 0);
        header = parseCSVLine(allLines[0]);

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
