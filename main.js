// https://www.omdbapi.com/?s=dune&type=movie&apikey=f474434e
const API_TOKEN = 'f474434e'

// Criar card do filme
async function createCardMovie(movie) {
    console.log(movie)
    const { Poster, Title, Type, Year, imdbID } = movie

    const movieElement = document.createElement('div')
                
    movieElement.classList.add('movie')
    movieElement.id = imdbID
    
    movieElement.innerHTML = `
        <img src="${Poster}" alt="banner do filme" />
        
        <div class="movie-content">
            <h3>${Title}</h3>
            
            <div class="movie-informations">
                <p>${Year}</p>
                
                    
                <img class"icon-favorited" src="assets/heart.svg" alt="Ícone de favoritos" />
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

    return movieElement
}

// Carregar filmes
async function loadMovies() {
    const highlightsMovies = document.querySelector('#highlights')

    try {
        const response = await fetch(`https://www.omdbapi.com/?s=harry&type=movie&apikey=${API_TOKEN}`) 
        const data = await response.json()
        
        if (data.Search) {  
            const movies = data.Search.slice(0, 5)
            
            highlightsMovies.innerHTML = ''

            for (const movie of movies) {

                const movieElement = await createCardMovie(movie)
                highlightsMovies.appendChild(movieElement)
            }
        } else {
            console.log('Nenhum filme encontrado!')
        }  
    } catch (error) {
        console.log(error)
    }
}

// Carregar filmes da pesquisa
async function searchMovie() {
    const resultOfSearch = document.getElementById('resultOfSearch')
    const searchInput = document.getElementById('searchInput').value
    
    if (searchInput) {
        try {
            const response = await fetch(`https://www.omdbapi.com/?s=${searchInput}&type=movie&apikey=${API_TOKEN}`)
            const data = await response.json()

            if (data.Search) { 
                const movies = await data.Search.slice(0, 5)
                console.log(movies)
                resultOfSearch.innerHTML = ''

                for (const movie of movies) {

                    const movieElement = await createCardMovie(movie)
                    resultOfSearch.appendChild(movieElement)
                }

            } else {
                console.log('Nenhum filme encontrado!')
            }

        } catch (error) {
            console.log(error)
        }
    } else {
        console.log('Campo de pesquisa vazio!')
    }
}

// Adicionar EventListener no botão de pesquisa
const searchButton = document.getElementById('searchButton')
searchButton.addEventListener('click', searchMovie)