let items = [];

// --- Ton design original conservé à 100% ---
function createItemCard(item, index) {
    // Correction dynamique du badge selon le statut
    const badgeClass = item.status === 'lost' ? 'badge-lost' : 'badge-recovered';
    const badgeText = item.status === 'lost' ? 'Lost' : 'Recovered';

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
                    <div class="card-info"><i class="far fa-calendar"></i> <span>${item.date}</span></div>
                    <div class="card-info"><i class="fas fa-map-marker-alt"></i> <span>${item.location}</span></div>
                    <div class="card-info"><i class="fas fa-tag"></i> <span>${item.category}</span></div>
                    <a href="chat.html?id=${item.id}" class="card-btn mt-3 text-center text-decoration-none d-inline-block">
                        Communication
                    </a>
                </div>
            </div>
        </div>`;
}

function renderItems(data) {
    const container = document.getElementById('itemsContainer');
    if (container) {
        if (data.length > 0) {
            container.innerHTML = data.map((item, index) => createItemCard(item, index)).join('');
        } else {
            container.innerHTML = `
                <div class="col-12 text-center mt-5">
                    <p style="color: #666; font-size: 1.1rem;">Aucun objet perdu ne correspond à votre recherche.</p>
                </div>`;
        }
    }
}

// 🔥 INITIALISATION
document.addEventListener('DOMContentLoaded', () => {

    // --- LE GARDIEN : TEST DE CONNEXION AVANT FORMULAIRE ---
    const reportBtn = document.querySelector('.btn-lost-report');

    if (reportBtn) {
        reportBtn.onclick = null; 

        reportBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            fetch("check-session.php")
            .then(res => res.json())
            .then(data => {
                if (data.loggedIn) {
                    window.location.href = "declare.html?status=lost";
                } else {
                    alert("Attention : Vous devez vous connecter pour remplir le formulaire !");
                    sessionStorage.setItem("nextTarget", "declare.html?status=lost");
                    window.location.href = "login.html";
                }
            })
            .catch(err => {
                console.error("Erreur serveur :", err);
                window.location.href = "login.html";
            });
        });
    }

    // --- CHARGEMENT DES DONNÉES DEPUIS LA BDD ---
    fetch("get-posts-public.php")
    .then(res => res.json())
    .then(posts => {
        // Filtrage strict pour n'afficher que les objets "lost" publiés
        const lostPosts = posts.filter(p => p.status === "lost" && p.published == 1);
        items = lostPosts;
        renderItems(items);
    })
    .catch(err => console.error("Erreur de chargement des items:", err));

    // --- SYSTÈME DE RECHERCHE ET FILTRES ---
    const searchInput = document.querySelector('.search-input');
    const categorySelect = document.querySelector('#categorySelect');
    const filterIcon = document.querySelector('.filter-icon');

    // Afficher/Cacher le menu des catégories (Ton style)
    if (filterIcon && categorySelect) {
        filterIcon.addEventListener('click', () => {
            categorySelect.style.display =
                categorySelect.style.display === "none" ? "inline-block" : "none";
        });
    }

    function applyFilters() {
        const searchTerm = (searchInput.value || "").toLowerCase();
        const categoryValue = (categorySelect.value || "").toLowerCase();

        const filteredItems = items.filter(item => {
            const matchSearch =
                item.title.toLowerCase().includes(searchTerm) ||
                item.description.toLowerCase().includes(searchTerm) ||
                item.location.toLowerCase().includes(searchTerm);

            const matchCategory =
                categoryValue === "" ||
                item.category.toLowerCase().includes(categoryValue);

            return matchSearch && matchCategory;
        });

        renderItems(filteredItems);
    }

    if (searchInput) searchInput.addEventListener('input', applyFilters);
    if (categorySelect) categorySelect.addEventListener('change', applyFilters);
});