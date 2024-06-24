const API_TOKEN = 'f474434e'


let FAVORITES_MOVIES = [
    'tt0241527',
    'tt0304141',
    'tt1201607',
    'tt1160419'
]

let MY_COMMENTS = [
    {
        id: 'tt0241527',
        text: 'Uau, uma obra fantatisca e genial. Oda Genio!'
    }
]

// Criar card do filme
function createCardMovie(movie) {
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
function createCardFavorite(poster, title, year, imdbID) {

    const movieElement = document.createElement('div')
    movieElement.classList.add('card-favorite')
    movieElement.setAttribute('movie-id-favorite', imdbID);

    movieElement.innerHTML = `
        <image src="${poster}" alt="banner do filme" />
                    
        <div class="card-favorite-content">
            <div>
                <h2>${title}</h2><span>(${year})</span>
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
    commentElement.setAttribute('movie-id-comment', imdbID)

    commentElement.innerHTML = `  
        <image src="${poster}" alt="banner do filme" />

        <div class="comment-content">
            <div class="comment-header">
                <div class="comment-title">
                    <h2>${title}</h2>
                    <span>(${year})</span>
                </div>

                <div class="comment-buttons-actions">
                    <image id=${imdbID} src="assets/edit.svg" alt="ícone do botão para edição do comentário" onclick="openModalEditComment(event.target.id)"/>

                    <image id=${imdbID} src="assets/trash.svg" alt="ícone do botão para excluir o comentário" onclick="openModalDeleteComment(event.target.id)"/>
                </div>
            </div>

            <p id="comment-text">${text}</p>
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
    
            const cardFavorite = await createCardFavorite(data.Poster, data.Title, data.Year, movieID)
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
    console.log('VALOR DA PESQUISA: ', searchInput)
    
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

// Abrir Modal - Movie
async function openModal(id) {
    const data = await dataMovieWithID(id)

    const modal = document.getElementById("modal-movie-data")
    const modalContent = document.querySelector('.modal-movie-content') 
    const formComment = document.getElementById('modal-form-add')
    
    modal.setAttribute('data-movie-id', id);

    document.getElementById("modal-movie-poster").src  = data.Poster
    document.getElementById("modal-movie-title").innerText = data.Title
    document.getElementById("modal-movie-year").innerText = `(${(data.Year)})`
    document.getElementById("modal-movie-rating").innerText = data.imdbRating
    document.getElementById("modal-movie-duration").innerText = data.Runtime
    document.getElementById("modal-movie-actors").innerText = data.Actors
    document.getElementById("modal-movie-directors").innerText = data.Director
    document.getElementById("modal-movie-resume").innerText = data.Plot

    changeFunctionOnFavoriteButton(id)
    
    modal.style.display = 'flex'
    modalContent.style.display = 'flex'
    formComment.style.display = 'none'

    // document.body.classList.add('modal-open');
}

// Abrir Modal - Delete Comment
function openModalDeleteComment(id) {
    const modal = document.getElementById('modal-delete-comment')
    
    modal.setAttribute('movie-id', id)
    modal.style.display = 'flex'
}

// Abri Modal - Edit Comment
function openModalEditComment(movieID) {
    const modal = document.getElementById('modal-edit-comment')
    const formEditComment = document.getElementById('modal-form-edit')

    const cardComment = document.querySelector(`[movie-id-comment="${movieID}"]`)
    const commentText = cardComment.querySelector('#comment-text').textContent
    const editInput = document.getElementById('comment-edit-input')
    
    editInput.value = commentText
    
    modal.setAttribute('movie-id', movieID)
    modal.style.display = 'flex'
    formEditComment.style.display = 'flex'

    console.log(formEditComment)
}

// Fechar Modal
function closeModal(id) {
    if (id === 'modal-movie-data' || id === 'modal-delete-comment' || id === "modal-edit-comment") {
        const modal = document.getElementById(id)

        modal.style.display = 'none'
        // document.body.classList.remove('modal-open');
    }
}

// Mudar função do botão para favoritar ou desfavoritar
function changeFunctionOnFavoriteButton(id) {
    const buttonFavorite = document.getElementById("modal-button-favorite")

    if (FAVORITES_MOVIES.includes(id)) { 
        buttonFavorite.innerText = 'Desfavoritar'
        buttonFavorite.onclick = removeToFavorites

    } else {  
        buttonFavorite.innerText = 'Favoritar'
        buttonFavorite.onclick = addToFavorites
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

    changeFunctionOnFavoriteButton(movieID)
}

// Remover filme dos favoritos
function removeToFavorites() {
    const movieID = document.getElementById('modal-movie-data').getAttribute('data-movie-id')
    const cardMovieFavorite = document.querySelector(`[movie-id-favorite="${movieID}"]`)

    cardMovieFavorite.remove()

    FAVORITES_MOVIES = FAVORITES_MOVIES.filter(id => id !== movieID)

    changeFunctionOnFavoriteButton(movieID)
}

// Mostrar formulário de comentários
function showFormComment() {
    const modalContent = document.querySelector('.modal-movie-content') 
    const formComment = document.getElementById('modal-form-add')
    const commentInput = document.getElementById('comment-input').value = ''

    modalContent.style.display = 'none'
    formComment.style.display = 'flex'
}

// Fechar formulário de comentários
function closeFormComment(event) {
    event.preventDefault()

    const modalContent = document.querySelector('.modal-movie-content') 
    const formComment = document.getElementById('modal-form-add')

    modalContent.style.display = 'flex'
    formComment.style.display = 'none'
}

// Adicionar comentário 
async function addComment(event) {
    event.preventDefault()

    const form = document.getElementById('form-comment')
    const commentInput = document.getElementById('comment-input')
    const formData = new FormData(form)
    const { comment } = Object.fromEntries(formData)

    if (comment) {
        const movieID = document.getElementById('modal-movie-data').getAttribute('data-movie-id')
        const moviesComments = document.getElementById('movies-comments')
        
        const title = document.getElementById("modal-movie-title").textContent
        const year = document.getElementById("modal-movie-year").textContent
        const yearStyled = year.replace(/[()]/g, '');
        const poster = document.getElementById("modal-movie-poster").src

        const cardComment = await createCardComment(title, yearStyled, poster, movieID, comment)
        moviesComments.appendChild(cardComment)
        MY_COMMENTS.push({
            id: movieID,
            text: comment
        })
        
        alert(`Comentário para o filme "${title}" realizado!`)

        closeFormComment(event)
        commentInput.value = ''
    } else {
        alert('Digite algo no comentário!')
    } 
}

// Editar comentário
function editComment(event) {
    event.preventDefault()
    
    const form = document.getElementById('form-edit-comment')
    const formData = new FormData(form)
    const { comment } = Object.fromEntries(formData)

    const movieID = document.getElementById('modal-edit-comment').getAttribute('movie-id')
    const cardComment = document.querySelector(`[movie-id-comment="${movieID}"]`)
    const commentText = cardComment.querySelector('#comment-text')
    
    if (comment) {
        if (comment !== commentText.textContent) {
            commentText.innerText = comment
    
            alert('Alteração realizada com sucesso!')
        } else {
            alert('Nenhuma alteração realizada!')
        }

        closeModal('modal-edit-comment')
    } else {
        alert('Comentário vazio, digite um texto!')
    }
}

// Remover comentário
function removeComment() {
    const movieID = document.getElementById('modal-delete-comment').getAttribute('movie-id')
    const cardComment = document.querySelector(`[movie-id-comment="${movieID}"]`)

    cardComment.remove()

    MY_COMMENTS = MY_COMMENTS.filter(comment => comment.id !== movieID)

    closeModal('modal-delete-comment')
}

// Abrir menu dropdown
function openDropdownMenu() {
    const menuIcon = document.getElementById('menus')

    menuIcon.style.display = 'flex'
}

// Fechar menu dropdown
function closeDropdownMenu() {
    const menuIcon = document.getElementById('menus')

    menuIcon.style.display = 'none'
}
 
// Adicionar EventListener no botão de pesquisa
const searchButton = document.getElementById('searchButton')
searchButton.addEventListener('click', searchMovie)

// Adicionar EventListener no input de pesquisa
const input = document.getElementById('searchInput');
input.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        searchMovie(); 
    }
});

// Mostrar/Esconder menu dropdown de acordo com tamanho da tela      
window.addEventListener('resize', function() {
    let width = window.innerWidth

    if (width >= 750) {
        document.getElementById('menus').style.display = 'flex'
    } else {
        document.getElementById('menus').style.display = 'none'
    }
})

// Carregar informações iniciais
async function loadData() {
    loadFeaturedMovies()

    loadFavoritedMovies()

    loadMoviesComments()
}