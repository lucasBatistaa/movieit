// https://www.omdbapi.com/?s=dune&type=movie&apikey=f474434e
const API_TOKEN = 'f474434e'

async function loadMovies() {
    const highlightsMovies = document.querySelector('#highlights')

    try {
        const response = await fetch(`https://www.omdbapi.com/?s=game&type=movie&apikey=${API_TOKEN}`) 
        const data = await response.json()
        
        if (data.Search) {
            const movies = data.Search.slice(0, 5)
            
            highlightsMovies.innerHTML = ''

            movies.forEach(movie => {
                const movieElement = document.createElement('div')
                
                movieElement.classList.add('movie')
                movieElement.id = movie.imdbID
                
                movieElement.innerHTML = `
                    <img src="${movie.Poster}" alt="banner do filme" />
                    
                    <div class="movie-content">
                        <h3>${movie.Title}</h3>
                        
                        <div class="movie-informations">
                            <p>${movie.Year}</p>
                            
                            <div class="movie-avaliation">
                                <img src="assets/star.svg" alt="Ícone de estrela das avaliações" />
                                
                                <p>8.8</p>
                            </div>
                        </div>
                    </div>
                    
                    <a href="#" class="onmouse" style="display: none;">Ver mais</a>
                `

                const onMouseElement = movieElement.querySelector('.onmouse')

                movieElement.addEventListener('mouseover', () => {
                    onMouseElement.style.display = 'flex'
                })

                movieElement.addEventListener('mouseout', () => {
                    onMouseElement.style.display = 'none'   
                })

                highlightsMovies.appendChild(movieElement)
            })
        } else {
            console.log('Nenhum filme encontrado!')
        }  
    } catch (error) {
        console.log(error)
    }
}
