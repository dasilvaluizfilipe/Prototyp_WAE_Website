async function loadFullTable() {
    const response = await fetch("../data/cyber_incidents.csv");
    const text = await response.text();

    const lines = text.split("\n").filter(l => l.trim().length > 0);
    const header = parseCSVLine(lines[0]);

    const rows = [];
    for (let i = 1; i < lines.length; i++) {
        rows.push(parseCSVLine(lines[i]));
    }

    const pageSize = 50; 
    let currentPage = 1;

    const container = document.getElementById("all-data-table");

    function renderPage(page) {
        currentPage = page;

        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;

        const pageRows = rows.slice(startIndex, endIndex);

        let html = "<div class='table-wrapper'><table class='datatable'><thead><tr>";

        for (let col of header) html += `<th>${col}</th>`;
        html += "</tr></thead><tbody>";

        for (let row of pageRows) {
            html += "<tr>";
            for (let col of row) html += `<td>${col}</td>`;
            html += "</tr>";
        }

        html += "</tbody></table></div>";

        // Pagination controls
        html += `<div class="pagination">`;

        const totalPages = Math.ceil(rows.length / pageSize);

        for (let p = 1; p <= totalPages; p++) {
            html += `<button class="page-btn ${p === currentPage ? "active" : ""}" onclick="loadPage(${p})">${p}</button>`;
        }

        html += `</div>`;

        container.innerHTML = html;
    }

    window.loadPage = renderPage;
    renderPage(1);
}

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

loadFullTable();
