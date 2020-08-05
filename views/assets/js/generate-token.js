function generateToken() {
    const length = 10
    const potentialCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let token = ''
    for (let i = length; i > 0; --i) {
        token += potentialCharacters[Math.round(Math.random() * (potentialCharacters.length - 1))]
    }
    return token
}

function generateAndDisplayNewToken() {
    const token = generateToken()
    document.getElementById("token-number-display-text").innerHTML = token
    document.getElementById("token-number-input").value = token
}
