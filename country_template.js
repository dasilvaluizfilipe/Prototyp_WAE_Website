// ============================================================================
// Holt den Country-Code aus der URL
// ============================================================================
function getCountryCode() {
    const params = new URLSearchParams(window.location.search);
    return params.get("code");
}

// ============================================================================
// Initialisiert die Seite (Titel, Beschreibung, Navigation)
// ============================================================================
function setupCountryPage(country) {

    // Titel setzen
    document.getElementById("country-title").innerText =
        "Cyber Incidents in " + country;

    // Beschreibung
    document.getElementById("country-description").innerText =
        `Diese Seite zeigt Cyber-Incidents für ${country}.`;

    // Navigation
    document.getElementById("country-link").innerText = country;
}


// ============================================================================
// WARTET, bis loadCountryData() verfügbar ist (Race-Condition-Fix)
// ============================================================================
function waitForCountryLoader(country) {

    if (typeof window.loadCountryData === "function") {
        console.log("loadCountryData gefunden – Lade Tabelle...");
        window.loadCountryData(country);
        return;
    }

    console.log("Warte auf loadCountryData...");
    setTimeout(() => waitForCountryLoader(country), 50);
}


// ============================================================================
// Hauptstart-Funktion
// ============================================================================
function initCountryPage() {

    console.log("country_template.js: START");

    const country = getCountryCode();

    if (!country) {
        document.getElementById("country-data").innerHTML =
            "<p style='color:red'>Kein ?code= Parameter gefunden.</p>";
        return;
    }

    // Seite vorbereiten
    setupCountryPage(country);

    // Warten, bis loadCountryData vorhanden ist → dann starten
    waitForCountryLoader(country);
}


// ============================================================================
// START
// ============================================================================
initCountryPage();
