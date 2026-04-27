
const form = document.getElementById('loginForm');

form.addEventListener('submit', function(e) {
    e.preventDefault();

    const data = {
        username: document.getElementById('username').value.trim(),
        password: document.getElementById('password').value
    };

    fetch('login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(res => {

        console.log(res); // 🔥 on voit tout

        if(res.msg === "Login successful") {

            sessionStorage.setItem("username", res.username);
            sessionStorage.setItem("role", res.role);

            // 🔥 FORCE CLEAN ROLE
            let role = res.role;
            role = role.toString().trim().toLowerCase();

            if(role === "admin") {
                window.location.href = "admin.html";
            } else {
                window.location.href = "profile.html";
            }

        } else {
            alert(res.msg);
        }

    })
    .catch(err => {
        console.error(err);
        alert("Server error");
    });
});