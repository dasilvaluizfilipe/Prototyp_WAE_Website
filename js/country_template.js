import { normalizeCountry } from './iso_map.js';

function getCountryCode() {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get("code");
    return normalizeCountry(raw);
}

function setupCountryPage(country) {
    document.getElementById("country-title").innerText =
        "Cyber Incidents in " + country;
    document.getElementById("country-description").innerText =
        `Diese Seite zeigt Cyber-Incidents für ${country}.`;
    document.getElementById("country-link").innerText = country;
}

function waitForCountryLoader(country) {
    if (typeof window.loadCountryData === "function") {
        window.loadCountryData(country);
        return;
    }
    setTimeout(() => waitForCountryLoader(country), 50);
}

function initCountryPage() {
    const country = getCountryCode();
    if (!country) {
        document.getElementById("country-data").innerHTML =
            "<p style='color:red'>Kein ?code= Parameter gefunden.</p>";
        return;
    }
    setupCountryPage(country);
    waitForCountryLoader(country);
}

initCountryPage();
