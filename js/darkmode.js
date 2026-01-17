 const toggleBtn = document.getElementById('dark-mode-toggle');

const body = document.body;



// Prüfen, ob beim letzten Besuch der Darkmode aktiviert wurde

if (localStorage.getItem('dark-mode') === 'enabled') {

    body.classList.add('dark-mode');

    toggleBtn.textContent = 'Light Mode';

}



toggleBtn.addEventListener('click', () => {

    body.classList.toggle('dark-mode');

   

    // Status in localStorage speichern und Button-Text anpassen

    if (body.classList.contains('dark-mode')) {

        localStorage.setItem('dark-mode', 'enabled');

        toggleBtn.textContent = 'Light Mode';

    } else {

        localStorage.setItem('dark-mode', 'disabled');

        toggleBtn.textContent = 'Dark Mode';

    }

});