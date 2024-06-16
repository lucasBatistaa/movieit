// https://www.omdbapi.com/?s=dune&type=movie&apikey=f474434e
const API_TOKEN = 'f474434e'

// Criar card do filme
async function createCardMovie(movie) {
    const { Poster, Title, Type, Year, imdbID } = movie

    const movieElement = document.createElement('div')
                
    movieElement.classList.add('movie')
    // movieElement.id = imdbID
    
    movieElement.innerHTML = `
        <img src="${Poster}" alt="banner do filme" />
        
        <div class="movie-content">
            <h3>${Title}</h3>
            
            <div class="movie-informations">
                <p>${Year}</p>
                
                    
                <img class"icon-favorited" src="assets/heart.svg" alt="Ícone de favoritos" />
            </div>
        </div>
        
        <a id="${imdbID}" href="#" class="onmouse" onclick="openModal(event.target.id)">Ver mais</a>
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

// Buscar informações do filme, com  base no imdbID
async function dataMovieWithID(idMovie) {
    try {
        const response = await fetch(`https://www.omdbapi.com/?i=${idMovie}&type=movie&apikey=f474434e`)
        const data = await response.json()

        return data
    
    } catch (error) {
        console.log(error)
    }
}

// Abrir Modal
async function openModal(id) {
    const data = await dataMovieWithID(id)
    console.log(data)

    const modal = document.getElementById("modal-movie-data")
    
    const poster = document.getElementById("modal-movie-poster")
    const title = document.getElementById("modal-movie-title")
    const year = document.getElementById("modal-movie-year")
    const rating = document.getElementById("modal-movie-rating")
    const duration = document.getElementById("modal-movie-duration")
    const actors = document.getElementById("modal-movie-actors")
    const directors = document.getElementById("modal-movie-directors")
    const resume = document.getElementById("modal-movie-resume")

    poster.src = data.Poster
    title.innerHTML = data.Title
    year.innerHTML = `(${(data.Year)})`
    rating.innerHTML = data.imdbRating
    duration.innerHTML = data.Runtime
    actors.innerHTML = data.Actors
    directors.innerHTML = data.Director
    resume.innerHTML = data.Plot

    modal.style.display = 'flex'
}

// Fechar Modal
async function closeModal(id) {
    if (id === "modal-movie-data") {
        const modal = document.getElementById(id)

        modal.style.display = 'none'
    }
}
 
// Adicionar EventListener no botão de pesquisa
const searchButton = document.getElementById('searchButton')
searchButton.addEventListener('click', searchMovie)