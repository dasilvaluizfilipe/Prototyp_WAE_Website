// ============================================================================
// Holt den Country-Code aus der URL
// ============================================================================
function getCountryCode() {
    const params = new URLSearchParams(window.location.search);
    return params.get("code");
}

// ============================================================================
// Minimal: Seite aufbauen und loadCountryData() aufrufen
// ============================================================================
function initCountryPage() {

    const country = getCountryCode();

    if (!country) {
        document.getElementById("country-data").innerHTML =
            "<p style='color:red'>Kein ?code= Parameter gefunden.</p>";
        return;
    }

    // Titel setzen
    document.getElementById("country-title").innerText =
        "Cyber Incidents in " + country;

    // Beschreibung
    document.getElementById("country-description").innerText =
        `Diese Seite zeigt Cyber-Incidents für ${country}.`;

    // Navigation
    document.getElementById("country-link").innerText = country;

    // 🔥 Tabelle laden (GANZE LOGIK IN loadCountryData.js)
    if (typeof loadCountryData === "function") {
        loadCountryData(country);
    } else {
        console.error("loadCountryData() nicht gefunden");
    }
}

// START
initCountryPage();
