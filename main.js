const API_TOKEN = 'f474434e'


let FAVORITES_MOVIES = [
    'tt0241527',
    'tt0304141',
    'tt1201607',
    'tt1160419'
]

const MY_COMMENTS = [
    {
        id: 'tt0241527',
        text: 'Uau, uma obra fantatisca e genial. Oda Genio!'
    }
]

// Criar card do filme
function createCardMovie(movie) {
    const { Poster, Title, Type, Year, imdbID } = movie

    console.log()
    const movieElement = document.createElement('div')
                
    movieElement.classList.add('movie')
    // movieElement.id = imdbID
    
    movieElement.innerHTML = `
        <img src="${Poster}" alt="banner do filme" />
        
        <div class="movie-content">
            <h3>${Title}</h3>
            
            <div class="movie-informations">
                <p>${Year}</p>
                
                    
                <img class"icon-favorited" src="${FAVORITES_MOVIES.includes(imdbID) ? 'assets/heart-fill.svg' : 'assets/heart.svg'}" alt="Ícone de favoritos" />
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

// Criar card dos favoritos
function createCardFavorite(poster, title, imdbID) {

    const movieElement = document.createElement('div')
    movieElement.classList.add('card-favorite')
    movieElement.setAttribute('movie-id', imdbID);

    movieElement.innerHTML = `
        <image src="${poster}" alt="banner do filme" />
                    
        <div class="card-favorite-content">
            <div>
                <h2>${title}</h2><span>(1999)</span>
            </div>
            
            <p>Sci-fi, action</p>
        </div>

        <a id="${imdbID}" href="#" class="card-about-favorite" onclick="openModal(event.target.id)">Ver mais</a>
    `

    const onMouseElement = movieElement.querySelector('.card-about-favorite')

    movieElement.addEventListener('mouseover', () => {
        onMouseElement.style.display = 'flex'
    })

    movieElement.addEventListener('mouseout', () => {
        onMouseElement.style.display = 'none'   
    })

    return movieElement
}

// Criar card de comentário
function createCardComment(title, year, poster, imdbID, text) {

    const commentElement = document.createElement('div') 
    commentElement.classList.add('comment')
    commentElement.setAttribute('movie-id', imdbID)

    commentElement.innerHTML = `  
        <image src="${poster}" alt="banner do filme" />

        <div class="comment-content">
            <div class="comment-header">
                <h2>${title}</h2><span>${year}</span>

                <div class="comment-buttons-actions">
                    <image src="assets/edit.svg" alt="ícone do botão para edição do comentário" />

                    <image src="assets/trash.svg" alt="ícone do botão para excluir o comentário" />
                </div>
            </div>

            <p>${text}</p>
        </div>
    `     

    return commentElement
}

// Carregar filmes em destaque
async function loadFeaturedMovies() {
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

// Carregar filmes favoritos
async function loadFavoritedMovies() {
    const favoritesMovies = document.getElementById('favorites-movies')

    try {
        for (const movieID of FAVORITES_MOVIES) {

            const response = await fetch(`https://www.omdbapi.com/?i=${movieID}&type=movie&apikey=${API_TOKEN}`) 
            const data = await response.json()
    
            const cardFavorite = await createCardFavorite(data.Poster, data.Title, movieID)
            favoritesMovies.appendChild(cardFavorite)
        }
    } catch (error) {
        console.log(error)
    }
}

// Carregar comentários dos filmes (Usuário atual)
async function loadMoviesComments() {
    const moviesComments = document.getElementById('movies-comments')

    try {
        for (const comment of MY_COMMENTS) {
            const response = await fetch(`https://www.omdbapi.com/?i=${comment.id}&type=movie&apikey=${API_TOKEN}`)
            const data = await response.json()

            const cardComment = await createCardComment(data.Title, data.Year, data.Poster, comment.id, comment.text)
            moviesComments.appendChild(cardComment)
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

    const modal = document.getElementById("modal-movie-data")
    const modalContent = document.querySelector('.modal-movie-content') 
    const formComment = document.getElementById('form-comment')
    
    modal.setAttribute('data-movie-id', id);

    document.getElementById("modal-movie-poster").src  = data.Poster
    document.getElementById("modal-movie-title").innerText = data.Title
    document.getElementById("modal-movie-year").innerText = `(${(data.Year)})`
    document.getElementById("modal-movie-rating").innerText = data.imdbRating
    document.getElementById("modal-movie-duration").innerText = data.Runtime
    document.getElementById("modal-movie-actors").innerText = data.Actors
    document.getElementById("modal-movie-directors").innerText = data.Director
    document.getElementById("modal-movie-resume").innerText = data.Plot

    const buttonFavorite = document.getElementById("modal-button-favorite")

    if (FAVORITES_MOVIES.includes(id)) {
        
        buttonFavorite.innerText = 'Desfavoritar'
        buttonFavorite.onclick = removeToFavorites
    } else {
        
        buttonFavorite.innerText = 'Favoritar'
        buttonFavorite.onclick = addToFavorites
    }

    modalContent.style.display = 'flex'
    formComment.style.display = 'none'
    modal.style.display = 'flex'
}

// Fechar Modal
async function closeModal(id) {
    if (id === "modal-movie-data") {
        const modal = document.getElementById(id)

        modal.style.display = 'none'
    }
}

// Adicionar filme aos favoritos
async function addToFavorites() {
    const movieID = document.getElementById('modal-movie-data').getAttribute('data-movie-id')

    const favoritesMovies = document.getElementById('favorites-movies')
    const poster = document.getElementById("modal-movie-poster")
    const title = document.getElementById("modal-movie-title")

    const cardFavorite = await createCardFavorite(poster.src, title.textContent, movieID)
    
    favoritesMovies.appendChild(cardFavorite)
    FAVORITES_MOVIES.push(movieID)
}

// Remover filme dos favoritos
function removeToFavorites() {

    const movieID = document.getElementById('modal-movie-data').getAttribute('data-movie-id')
    const cardMovieFavorite = document.querySelector(`[movie-id="${movieID}"]`)

    cardMovieFavorite.remove()

    FAVORITES_MOVIES = FAVORITES_MOVIES.filter(id => id !== movieID)
}

// Mostrar formulário de comentários
function showFormComment() {
    const modalContent = document.querySelector('.modal-movie-content') 
    const formComment = document.getElementById('form-comment')

    modalContent.style.display = 'none'
    formComment.style.display = 'flex'
}

// Fechar formulário de comentários
function closeFormComment(event) {
    event.preventDefault()
    const modalContent = document.querySelector('.modal-movie-content') 
    const formComment = document.getElementById('form-comment')

    modalContent.style.display = 'flex'
    formComment.style.display = 'none'
}

// Adicionar comentário 
async function addComment(event) {
    event.preventDefault()

    const form = document.getElementById('form-comment')
    const formData = new FormData(form)
    const { comment } = Object.fromEntries(formData)

    if (comment) {
        const movieID = document.getElementById('modal-movie-data').getAttribute('data-movie-id')
        const moviesComments = document.getElementById('movies-comments')
        
        const title = document.getElementById("modal-movie-title").textContent
        const year = document.getElementById("modal-movie-year").textContent
        const poster = document.getElementById("modal-movie-poster").src

        console.log(title, year, poster)

        const cardComment = await createCardComment(title, year, poster, movieID, comment)
        moviesComments.appendChild(cardComment)
        MY_COMMENTS.push({
            id: movieID,
            text: comment
        }) 
    }
}
 
// Adicionar EventListener no botão de pesquisa
const searchButton = document.getElementById('searchButton')
searchButton.addEventListener('click', searchMovie)

// Carregar informações iniciais
async function loadData() {
    loadFeaturedMovies()

    loadFavoritedMovies()

    loadMoviesComments()
}