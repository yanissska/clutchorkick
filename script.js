document.getElementById('discordLogin').addEventListener('click', () => {
    const clientId = '1297223688701345842';
    const redirectUri = encodeURIComponent('https://yanissska.github.io/clutchorkick/');
    window.location.href = `https://discord.com/oauth2/authorize?client_id=1297223688701345842&response_type=code&redirect_uri=https%3A%2F%2Fyanissska.github.io%2Fclutchorkick%2F&scope=identify`;
});

function getDiscordUserInfo(accessToken) {
    fetch('https://discord.com/api/users/@me', {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('username').textContent = data.username;
        document.getElementById('avatar').src = `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png`;
        document.getElementById('login').style.display = 'none';
        document.getElementById('form').style.display = 'block';
    });
}

window.onload = function() {
    const fragment = new URLSearchParams(window.location.hash.slice(1));
    const [accessToken, tokenType] = [fragment.get('access_token'), fragment.get('token_type')];
    if (accessToken) {
        getDiscordUserInfo(accessToken);
    }
};

document.getElementById('valorantForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const submitButton = document.querySelector('#valorantForm button');
    submitButton.disabled = true;
    submitButton.textContent = "Envoi en cours...";
    
    const valorantPseudo = document.getElementById('valorantPseudo').value;
    const rank = document.getElementById('rank').value;
    const webhookUrl = 'https://discord.com/api/webhooks/1340709394073260063/P1XU8Eok5qPMEyvzgCIkN_pSGcQMlSISfZJ-kXbnDD2Nz4i-Gf6uIKdKmBtQNoU7b8YA';

    const embed = {
        title: "Nouvelle inscription",
        fields: [
            { name: "Pseudo Discord", value: document.getElementById('username').textContent },
            { name: "Pseudo Valorant", value: valorantPseudo },
            { name: "Rank Valorant", value: rank }
        ]
    };

    fetch(webhookUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ embeds: [embed] }),
    }).then(response => {
        if (response.ok) {
            console.log("Inscription envoyée !");
            submitButton.textContent = "Inscription réussie ! 🎉";
        } else {
            console.error("Erreur lors de l'envoi.");
            submitButton.textContent = "Erreur, réessayez";
        }
    }).catch(error => {
        console.error("Erreur réseau :", error);
        submitButton.textContent = "Erreur, réessayez";
    }).finally(() => {
        setTimeout(() => {
            submitButton.disabled = false;
            submitButton.textContent = "S'inscrire";
        }, 5000);
    });
});
