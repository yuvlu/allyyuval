document.addEventListener('DOMContentLoaded', function() {
    fetch('http://localhost:3000/dailyPhoto')
        .then(response => response.text())
        .then(html => {
            document.getElementById('photo-container').innerHTML = html;
        })
        .catch(error => {
            console.error('Failed to fetch daily photo:', error);
            document.getElementById('photo-container').innerHTML = '<p>Failed to load the daily photo.</p>';
        });
});

