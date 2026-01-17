async function loadNews() {
    const display = document.getElementById('news-ticker-content');
    try {
        const response = await fetch('/api/news');
        const news = await response.json();

        let currentIndex = 0;

        function rotateNews() {
            const item = news[currentIndex];
            display.innerHTML = `<a href="${item.link}" target="_blank">BREAKING: ${item.title}</a>`;
            
            // Animation/Fade-Effekt hier möglich
            
            currentIndex = (currentIndex + 1) % news.length;
        }

        rotateNews();
        setInterval(rotateNews, 5000); // Alle 5 Sekunden wechseln
    } catch (e) {
        display.innerText = "News-Ticker aktuell nicht verfügbar.";
    }
}

loadNews();