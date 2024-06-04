// https://www.omdbapi.com/?s=dune&type=movie&apikey=f474434e
const API_TOKEN = 'f474434e'

const loadMovies = async () => {
    const main = document.querySelector('main')

    try {
        const response = await fetch(`https://www.omdbapi.com/?t=harry&apikey=f474434e`) 
        const data = await response.json()
        
        console.log(data)

        main.innerHTML += `
            <div> 
                <h1>${data.Title}</h1>
                <img src="${data.Poster}" />
                <br>
                <span>Nota: ${data.imdbRating}</span>
            </div>
        `
    } catch (error) {
        console.log(error)
    }
}