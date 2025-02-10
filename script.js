function handleLogin() {
    const login = document.getElementById("login").value;
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("error-message");
    errorMessage.textContent = "";

    if (!login || !password) {
        errorMessage.textContent = "Merci de remplir les champs";
        return;
    }

    fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            localStorage.setItem("token", data.token);
            window.location.href = "/dashboard";
        } else {
            errorMessage.textContent = "Erreur à la connexion";
        }
    })
    .catch(() => {
        errorMessage.textContent = "Une erreur s'est produite";
    });
}