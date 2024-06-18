alert(`
    LOGIN DE TESTE: 
    
    USERNAME: admin
    SENHA: 123
`)

const login = (event) => {
    event.preventDefault()
    
    const formData = new FormData(event.target)
	const user = Object.fromEntries(formData)

    // VALIDAR LOGIN
    if (user.username === 'admin' & user.password === '123') {
        window.location.href = 'index.html'

    } else {
        alert('Username e/ou senha incorreto(s)!')
    }
}