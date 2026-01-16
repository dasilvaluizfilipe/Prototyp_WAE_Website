const toggleBtn = document.getElementById('dark-mode-toggle');
const body = document.body;

// 1. Stand beim Laden prüfen
if (localStorage.getItem('dark-mode') === 'enabled') {
    body.classList.add('dark-mode');
    toggleBtn.textContent = 'Light';
}

// 2. Klick-Event
toggleBtn.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    
    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('dark-mode', 'enabled');
        toggleBtn.textContent = 'Light';
    } else {
        localStorage.setItem('dark-mode', 'disabled');
        toggleBtn.textContent = 'Mode';
    }
});