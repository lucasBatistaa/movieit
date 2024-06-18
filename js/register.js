const register = (event) => {
    event.preventDefault()

    const formData = new FormData(event.target)
    const user = Object.fromEntries(formData)

    console.log(user)

    if (user.email !== 'admin@gmail.com') {
        if (user.username !== 'admin') {
            if (user.password === user.confirmPassword) {
                window.location.href = 'index.html'
            } else {
                alert('Senhas não coincidem!')
            }
        } else {
            alert('Username já existe!')
        }
    } else {
        alert('Uma conta com este e-mail já existe!')
    }
}