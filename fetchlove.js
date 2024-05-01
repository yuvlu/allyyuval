function fetchLovePoems() {
    const baseUrl = "https://poetrydb.org/";
    const query = "lines/love"; // Search for poems containing the word "love" in their lines

    fetch(`${baseUrl}${query}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(poems => {
            // Filter poems to include only those with fewer than 10 lines
            const shortPoems = poems.filter(poem => poem.lines.length < 10);

            // Assuming the filtered response is an array of short poems
            if (shortPoems.length > 0) {
                // Select a random short poem from the array
                const poem = shortPoems[Math.floor(Math.random() * shortPoems.length)];
                console.log(poem); // Display the fetched poem in the console

                // Process and display the selected poem
                const poemsContainer = document.getElementById('poem-container');
                poemsContainer.innerHTML = ''; // Clear existing poems
                const poemElement = document.createElement('div');
                poemElement.innerHTML = `<h2>${poem.title}</h2><p>By ${poem.author}</p><pre>${poem.lines.join('\n')}</pre>`;
                poemsContainer.appendChild(poemElement);
            } else {
                document.getElementById('poem-container').innerText = 'No short poems found.';
            }
        })
        .catch(error => {
            console.error('Error fetching love poems:', error);
            document.getElementById('poem-container').innerText = 'Failed to load poems.';
        });
}

document.addEventListener('DOMContentLoaded', fetchLovePoems);
