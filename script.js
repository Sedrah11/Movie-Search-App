const apiKey = '6c126144'; // Your OMDb API key
const searchBtn = document.getElementById('searchBtn');
const movieInput = document.getElementById('movieInput');
const movieContainer = document.getElementById('movieContainer');

// Search on button click or Enter key
searchBtn.addEventListener('click', () => searchMovies());
movieInput.addEventListener('keyup', (e) => {
    if (e.key === "Enter") searchMovies();
});

async function searchMovies() {
    const query = movieInput.value.trim();
    if (!query) return;

    movieContainer.innerHTML = 'Loading...';

    try {
        // Step 1: Partial search using "s" parameter
        const searchResponse = await fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=${apiKey}`);
        const searchData = await searchResponse.json();

        if (searchData.Response === "True") {
            movieContainer.innerHTML = '';
            // Step 2: Fetch full details for each movie
            for (const movie of searchData.Search) {
                const detailsResponse = await fetch(`https://www.omdbapi.com/?i=${movie.imdbID}&apikey=${apiKey}`);
                const details = await detailsResponse.json();

                const movieCard = document.createElement('div');
                movieCard.classList.add('movie-card');
                movieCard.innerHTML = `
                    <img src="${details.Poster !== "N/A" ? details.Poster : 'https://via.placeholder.com/300x450?text=No+Image'}" alt="${details.Title}">
                    <h2>${details.Title}</h2>
                    <p><strong>Plot:</strong> ${details.Plot}</p>
                    <p><strong>Cast:</strong> ${details.Actors}</p>
                    <p><strong>Year:</strong> ${details.Year}</p>
                    <p><strong>Genre:</strong> ${details.Genre}</p>
                `;
                movieContainer.appendChild(movieCard);
            }
        } else {
            movieContainer.innerHTML = 'Movie not found!';
        }
    } catch (error) {
        movieContainer.innerHTML = 'Error fetching data!';
        console.error(error);
    }
}
