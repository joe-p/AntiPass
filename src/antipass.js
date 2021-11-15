const argon2 = require('argon2-browser')

export function setDefaults() {
    const username = (new URL(document.location)).searchParams.get('username')
    const site = (new URL(document.location)).searchParams.get('site')
    const length = (new URL(document.location)).searchParams.get('length')

    document.getElementById('username').value = username
    document.getElementById('site').value = site
    document.getElementById('length').value = length
}

export function hexToPassword (hex) {
    const hexArray = hex.match(/.{2}/g);
    const outputArray = []

    hexArray.forEach(hex => {
        const n = (parseInt(hex, 16) % 95) + 32
        outputArray.push(String.fromCharCode(n))
    });

    return outputArray.join('')
}

export async function generateOutput () {
    const site = document.getElementById('site').value
    const username = document.getElementById('username').value
    const passphrase = document.getElementById('passphrase').value

    const length = document.getElementById('length').value

    argon2.hash({
        pass: site + username,
        salt: passphrase,
        hashLen: length,
        type: argon2.ArgonType.Argon2id
    })
        .then(h => {
            document.getElementById("output").value = hexToPassword(h.hashHex)
        })
        .catch(e => {
            if (e.code === -6) {
                alert("Passphrase is too short. It must have 8 or more characters.")
            }
            else {
                alert("ERROR " + e.code + ": " + e.message)
            }
        })
}
