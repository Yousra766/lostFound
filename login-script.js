const form = document.getElementById('loginForm');

form.addEventListener('submit', function(e) {
    e.preventDefault();

    const data = {
        username: document.getElementById('username').value.trim(),
        password: document.getElementById('password').value
    };

    fetch('http://localhost/projetphp/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(res => {
        if(res.msg === "Login successful") {
            sessionStorage.setItem("user_id", res.user_id);
            sessionStorage.setItem("username", res.username);
            sessionStorage.setItem("role", res.role);

            const role = (res.role || "").toLowerCase().trim();

            // 1. Priorité Sécurité Admin
            if(role === "admin") {
                window.location.href = "admin.html";
            } 
            // 2. Redirection vers le besoin initial
            else {
                const nextTarget = sessionStorage.getItem("nextTarget");
                if (nextTarget) {
                    sessionStorage.removeItem("nextTarget");
                    window.location.href = nextTarget;
                } else {
                    window.location.href = "home.html";
                }
            }
        } else {
            alert(res.msg);
        }
    });
});