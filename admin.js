console.log("🔥 ADMIN JS CHARGÉ");// ══════════════════════════════
//  State
// ══════════════════════════════
let adminPosts = [

];

let userData = {
    name: '',
    email: '',
    phone: '',
    avatar: null
};

// ══════════════════════════════
//  Helpers
// ══════════════════════════════
function placeholder(title) {
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='280'%3E%3Crect width='400' height='280' fill='%23eef0f0'/%3E%3Ctext x='50%25' y='50%25' font-family='sans-serif' font-size='22' fill='%23aaa' text-anchor='middle' dominant-baseline='middle'%3E${encodeURIComponent(title)}%3C/text%3E%3C/svg%3E`;
}

// ══════════════════════════════
//  Build card HTML
// ══════════════════════════════
function buildCard(post, index) {
    const statusClass = post.status === 'found' ? 'badge-found'
                      : post.status === 'recovered' ? 'badge-recovered'
                      : 'badge-lost';
    const statusText = post.status === 'found' ? 'Found'
                     : post.status === 'recovered' ? 'Recovered'
                     : 'Lost';

    const imgSrc = post.image || placeholder(post.title);

    return `
    <div class="col-md-6 col-lg-4" id="card-${post.id}">
      <div class="admin-card" style="animation-delay:${index * 0.07}s">

        <!-- Circular icon buttons: publish + delete -->
        <div class="card-top-actions">
          <button class="action-icon-btn publish"
                  title="Publish"
                  onclick="togglePublish(${post.id})">
            <i class="fas ${post.published == 1 ? 'fa-eye' : 'fa-eye-slash'}"></i>
          </button>
          <button class="action-icon-btn delete"
                  title="Delete"
                  onclick="deletePost(${post.id})">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>

        <!-- Image + status badge -->
        <div class="card-img-container">
          <img class="card-img"
               src="${imgSrc}"
               alt="${post.title}"
               onerror="this.src='${placeholder(post.title)}'">
          <span class="card-badge ${statusClass}">${statusText}</span>
        </div>

        <!-- Body — identical structure to lost.html -->
        <div class="card-body-inner">
          <h3 class="card-title-text">${post.title}</h3>
          <p class="card-desc-text">${post.description}</p>
          <div class="card-info-row">
            <i class="far fa-calendar"></i>
            <span>${post.status === 'found' ? 'Found on' : 'Lost on'} ${post.date}</span>
          </div>
          <div class="card-info-row">
            <i class="fas fa-map-marker-alt"></i>
            <span>${post.location}</span>
          </div>
          <div class="card-info-row">
            <i class="fas fa-tag"></i>
            <span>${post.category}</span>
          </div>
        </div>

      </div>
    </div>`;
}

// ══════════════════════════════
//  Render
// ══════════════════════════════
function renderAdmin() {
    const container = document.getElementById('adminPostsContainer');
    container.innerHTML = adminPosts.map((p, i) => buildCard(p, i)).join('');
}

// ══════════════════════════════
//  Toggle publish
// ══════════════════════════════
function togglePublish(id) {
    fetch("toggle-publish.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ id })
    })
    .then(res => res.json())
    .then(res => {

        console.log(res);

        if (res.msg !== "updated") return;

        // update state
        const post = adminPosts.find(p => p.id == id);
        if (post) post.published = Number(res.published);

        // update icon
        const icon = document.querySelector(`#card-${id} .publish i`);

        if (icon) {
            icon.classList.remove("fa-eye", "fa-eye-slash");
            icon.classList.add(res.published == 1 ? "fa-eye" : "fa-eye-slash");
        }
    })
    .catch(err => console.error(err));
}

// ══════════════════════════════
//  Delete post
// ══════════════════════════════
function deletePost(id) {
    if (!confirm('Delete this post?')) return;

    fetch("delete-post.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ id })
    })
    .then(res => res.json())
    .then(res => {
        console.log(res);

        if (res.msg === "deleted") {

            const cardWrapper = document.getElementById(`card-${id}`);
            if (!cardWrapper) return;

            const cardEl = cardWrapper.querySelector('.admin-card');
            cardEl.classList.add('deleting');

            setTimeout(() => {
                adminPosts = adminPosts.filter(p => p.id != id);
                cardWrapper.remove();
            }, 300);
        } else {
            alert("Delete failed");
        }
    })
    .catch(err => {
        console.error(err);
        alert("Server error");
    });
}

// ══════════════════════════════
//  Update header display
// ══════════════════════════════

    

   
function updateHeader() {
    console.log("🔥 updateHeader marche");
    document.getElementById('userName').textContent  = userData.name;
    document.getElementById('userEmail').textContent = userData.email;
    document.getElementById('userPhone').textContent = userData.phone;

    const avatarEl = document.getElementById('userAvatar');
    if (userData.avatar) {
        avatarEl.innerHTML = `<img src="${userData.avatar}" alt="avatar">`;
    } else {
        avatarEl.innerHTML = `<i class="fas fa-user"></i>`;
    }

    // Sync modal avatar too
    const modalAvatar = document.getElementById('profileAvatar');
    if (modalAvatar) {
        if (userData.avatar) {
            modalAvatar.innerHTML = `<img src="${userData.avatar}" alt="avatar">`;
            
        } else {
            modalAvatar.innerHTML = `<i class="fas fa-user"></i>`;
        }
    }
}

// ══════════════════════════════
//  Modal helpers
// ══════════════════════════════
function openModal(id)  { document.getElementById(id).classList.add('active'); }
function closeModal(id) { document.getElementById(id).classList.remove('active'); }

// ══════════════════════════════
//  Event listeners
// ══════════════════════════════
function setupListeners() {

    // Open edit account modal
    document.getElementById('editAccountBtn').addEventListener('click', () => {
        document.getElementById('editName').value  = userData.name;
        document.getElementById('editEmail').value = userData.email;
        document.getElementById('editPhone').value = userData.phone;
        updateHeader(); // sync avatar inside modal
        openModal('accountModal');
    });

    // Close modal buttons
    document.getElementById('closeAccountModal').addEventListener('click', () => closeModal('accountModal'));
    document.getElementById('cancelAccountBtn').addEventListener('click',  () => closeModal('accountModal'));

    // Click outside modal to close
    document.getElementById('accountModal').addEventListener('click', (e) => {
        if (e.target.id === 'accountModal') closeModal('accountModal');
    });

    // Save account
    document.getElementById('saveAccountBtn').addEventListener('click', () => {
        const name  = document.getElementById('editName').value.trim();
        const email = document.getElementById('editEmail').value.trim();
        const phone = document.getElementById('editPhone').value.trim();

        if (!name || !email || !phone) {
            alert('Please fill in all fields.');
            return;
        }

        fetch("http://localhost/projetphp/update-user.php", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        name: name,
        email: email,
        phone: phone,
        avatar: userData.avatar || null
    })
})
.then(res => res.json())
.then(res => {
    alert(res.msg);

    // update local UI (sans DB local fake)
    userData.name = name;
    userData.email = email;
    userData.phone = phone;

    updateHeader();
    closeModal('accountModal');
})
.catch(err => {
    console.error(err);
    alert("Error saving to database");
});
    });

    // Camera / avatar upload
    document.getElementById('cameraBtn').addEventListener('click', () => {
        document.getElementById('profileImageInput').click();
    });

    document.getElementById('profileImageInput').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            userData.avatar = ev.target.result;
            // Update modal avatar preview immediately
            const modalAvatar = document.getElementById('profileAvatar');
            modalAvatar.innerHTML = `<img src="${ev.target.result}" alt="avatar">`;
            updateHeader();
        };
        reader.readAsDataURL(file);
    });
}

// ══════════════════════════════
//  Init
// ══════════════════════════════
document.addEventListener('DOMContentLoaded', () => {

    // 🔐 1) vérifier si admin connecté
    fetch("http://localhost/projetphp/checkAdmin.php", {
        credentials: "include"
    })
    .then(res => res.json())
    .then(auth => {

        if(!auth.authorized){
            alert("Accès refusé");
            window.location.href = "login.html";
            return;
        }

        // ✅ 2) charger les infos user admin
        fetch("http://localhost/projetphp/get-user.php", {
            credentials: "include"
        })
        .then(res => res.json())
        .then(user => {

            userData.name = user.username;
            userData.email = user.email;
            userData.phone = user.phone;
            userData.avatar = user.avatar;

            updateHeader();
        });

        // ✅ 3) charger les posts admin
        fetch("get-posts.php")
        .then(res => res.json())
        .then(posts => {
            adminPosts = posts.map(p => ({
                ...p,
                published: Number(p.published)
            }));
            renderAdmin();
        });

        setupListeners();

    })
    .catch(() => {
        window.location.href = "login.html";
    });

});
