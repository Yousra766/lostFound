let items = [];

/**
 * Génère le code HTML d'une carte d'objet trouvé
 * Garde ton style et tes classes CSS originales
 */
function createItemCard(item, index) {
    const badgeClass = 'badge-found';
    const badgeText = 'Found';

    return `
        <div class="col-md-6 col-lg-4">
            <div class="card-item position-relative" style="animation-delay: ${index * 0.1}s">
                <div class="card-img-container">
                    <img src="${item.image}" alt="${item.title}" class="card-img">
                    <span class="card-badge ${badgeClass}">${badgeText}</span>
                </div>
                <div class="card-body">
                    <h3 class="card-title">${item.title}</h3>
                    <p class="card-description">${item.description}</p>
                    <div class="card-info">
                        <i class="far fa-calendar"></i>
                        <span>${item.date}</span>
                    </div>
                    <div class="card-info">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${item.location}</span>
                    </div>
                    <div class="card-info">
                        <i class="fas fa-tag"></i>
                        <span>${item.category}</span>
                    </div>
                    <a href="chat.html?id=${item.id}" class="card-btn mt-3 text-center text-decoration-none d-inline-block">
                        Communication
                    </a>
                </div>
            </div>
        </div>
    `;
}

/**
 * Affiche les cartes dans le conteneur HTML
 */
function renderItems(data) {
    const container = document.getElementById('itemsContainer');
    if (container) {
        if (data.length > 0) {
            container.innerHTML = data.map((item, index) => createItemCard(item, index)).join('');
        } else {
            container.innerHTML = '<div class="col-12 text-center mt-5"><p>Aucun objet trouvé ne correspond à votre recherche.</p></div>';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {

    const searchInput = document.querySelector('.search-input');
    const categorySelect = document.querySelector('#categorySelect');
    const filterIcon = document.querySelector('.filter-icon');

    // --- LE GARDIEN (Vérification Login) ---
    const reportBtn = document.querySelector('.btn-lost-report') || document.querySelector('.btn-found-report');
    if (reportBtn) {
        reportBtn.onclick = null; 
        reportBtn.addEventListener('click', (e) => {
            e.preventDefault();
            fetch("check-session.php")
            .then(res => res.json())
            .then(data => {
                if (data.loggedIn) {
                    window.location.href = "declare.html?status=found";
                } else {
                    alert("Attention : Vous devez vous connecter d'abord !");
                    sessionStorage.setItem("nextTarget", "declare.html?status=found");
                    window.location.href = "login.html";
                }
            })
            .catch(err => console.error("Erreur session:", err));
        });
    }

    // --- FONCTION DE RECHERCHE DYNAMIQUE (DATABASE) ---
    function loadData() {
        const val = searchInput ? searchInput.value : "";
        const cat = categorySelect ? categorySelect.value : "";

        // On interroge le PHP avec les filtres en cours
        fetch(`get-posts-public.php?status=found&search=${encodeURIComponent(val)}&category=${encodeURIComponent(cat)}`)
            .then(res => res.json())
            .then(data => {
                items = data;
                renderItems(items); // Affiche les résultats
            })
            .catch(err => console.error("Erreur de recherche:", err));
    }

    // --- TOGGLE CATEGORY (Affichage/Masquage du select) ---
    if (filterIcon && categorySelect) {
        filterIcon.addEventListener('click', () => {
            categorySelect.style.display =
                categorySelect.style.display === "none" ? "inline-block" : "none";
        });
    }

    // --- ÉVÉNEMENTS ---
    if (searchInput) searchInput.addEventListener('input', loadData);
    if (categorySelect) categorySelect.addEventListener('change', loadData);

    // Chargement initial au démarrage de la page
    loadData();
});