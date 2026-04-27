// دالة تجلب الـ Header وتحطه في الصفحة
function loadHeader() {
    const headerHTML = `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary-dark sticky-top">
        <div class="container-fluid px-4">
            <a class="navbar-brand d-flex align-items-center" href="index.html">
                <i class="fas fa-search me-2"></i>
                <span class="fw-bold">LOSTANDFOUND</span>
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav mx-auto">
                    <li class="nav-item"><a class="nav-link" href="index.html">Home</a></li>
                    <li class="nav-item"><a class="nav-link" href="found.html" id="nav-found">Found</a></li>
                    <li class="nav-item"><a class="nav-link" href="lost.html" id="nav-lost">Lost</a></li>
                    <li class="nav-item"><a class="nav-link" href="profile.html" id="nav-profile">Profile</a></li>
                </ul>
                <div class="d-flex gap-2">
                    <button class="btn btn-light px-4">Login</button>
                    <button class="btn btn-light px-4">Signup</button>
                </div>
            </div>
        </div>
    </nav>
    `;

    // نحوسو على عنصر في الصفحة باه نحطو فيه الـ Header
    const headerElement = document.getElementById('main-header');
    if (headerElement) {
        headerElement.innerHTML = headerHTML;
        highlightActivePage(); // دالة باه تخلي الصفحة اللي راك فيها تبان active
    }
}

// دالة تخلي الرابط active حسب الصفحة اللي راك فيها
function highlightActivePage() {
    const path = window.location.pathname;
    const page = path.split("/").pop();
    
    if (page === "found.html") document.getElementById('nav-found')?.classList.add('active');
    if (page === "lost.html") document.getElementById('nav-lost')?.classList.add('active');
    if (page === "profile.html") document.getElementById('nav-profile')?.classList.add('active');
}

// تشغيل الدالة بمجرد تحميل الصفحة
document.addEventListener('DOMContentLoaded', loadHeader);
