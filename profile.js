// State Management
let posts = [];

let userData = {
    name: 'User Name',
    email: 'username@gmail.com',
    phone: '07749286489',
    avatar: null
};



function fetchPosts() {
    fetch("http://localhost/projetphp/get-user-posts.php", {
        credentials: "include"
    })
    .then(res => res.json())
    .then(data => {
        posts = data;
        renderPosts();
    })
    .catch(err => console.error(err));
}



let currentEditingPostId = null;

// Initialize
function init() {
    fetchUser();   // 🔥 AJOUTER ÇA
    fetchPosts();
    setupEventListeners();
}
function fetchUser() {
    fetch("http://localhost/projetphp/get-user.php", {
        credentials: "include"
    })
    .then(res => res.json())
    .then(user => {

        if (!user || user.error) return;

        userData.name = user.username;
        userData.email = user.email;
        userData.phone = user.phone;
        userData.avatar = user.avatar;

        updateHeader(); // 🔥 IMPORTANT
    })
    .catch(err => console.error(err));
}

// Render Posts
function renderPosts() {
    const grid = document.getElementById('postsGrid');
    grid.innerHTML = '';

    posts.forEach(post => {
        const card = createPostCard(post);
        grid.appendChild(card);
    });
}

// Create Post Card
function createPostCard(post) {
    const card = document.createElement('div');
    card.className = 'post-card';
    card.id = `post-${post.id}`;

    const badgeClass = post.status;
    const badgeText = post.status === 'lost' ? 'Lost' : (post.status === 'found' ? 'Found' : 'Recovered');

    const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
    });

    card.innerHTML = `
        <div class="post-image-container">
            <img src="${post.image}" alt="${post.title}" class="post-image">
            <div class="post-actions">
                <button class="action-btn edit-post" title="Edit">
                    <i class="fas fa-pen"></i>
                </button>
                <button class="action-btn delete-btn delete-post" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="badge ${badgeClass}">${badgeText}</div>
        </div>
        <div class="post-content">
            <div class="post-title">${post.title}</div>
            <div class="post-description">${post.description}</div>
            <div class="post-meta">
                <div class="meta-item">
                    <i class="fas fa-calendar"></i>
                    <span>le ${formattedDate}</span>
                </div>
                <div class="meta-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${post.location}</span>
                </div>
                <div class="meta-item">
                    <i class="fas fa-tag"></i>
                    <span>${post.category}</span>
                </div>
            </div>
        </div>
    `;

    // Event listeners
    card.querySelector('.edit-post').addEventListener('click', () => editPost(post.id));
    card.querySelector('.delete-post').addEventListener('click', () => deletePost(post.id));

    return card;
}

// Edit Post
function editPost(postId) {
    currentEditingPostId = postId;
    const post = posts.find(p => p.id === postId);
    document.getElementById('typeRecovered').checked = post.status === 'recovered';
    document.getElementById('postModalTitle').textContent = 'Edit Post';
    document.getElementById('typeLost').checked = post.type === 'lost';
    document.getElementById('typeFound').checked = post.type === 'found';
    document.getElementById('postTitle').value = post.title;
    document.getElementById('postDescription').value = post.description;
    document.getElementById('postDate').value = post.date;
    document.getElementById('postLocation').value = post.location;
    document.getElementById('postCategory').value = post.category;

    // Update image preview
    const preview = document.getElementById('imagePreview');
    preview.innerHTML = `<img src="${post.image}" alt="preview" style="width: 100%; height: 100%; object-fit: cover;">`;

    openModal('postModal');
}

// Delete Post
function deletePost(postId) {
    if (!confirm("Delete this post?")) return;

    fetch("http://localhost/projetphp/delete-post.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ id: postId })
    })
    .then(res => res.json())
    .then(res => {
        console.log(res);

        if (res.msg === "deleted") {
            const card = document.getElementById(`post-${postId}`);
            card.classList.add('deleting');

            setTimeout(() => {
                posts = posts.filter(p => p.id !== postId);
                renderPosts();
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
// Add/Save Post
function savePost() {
    const type = document.querySelector('input[name="type"]:checked').value;
    const title = document.getElementById('postTitle').value;
    const description = document.getElementById('postDescription').value;
    const date = document.getElementById('postDate').value;
    const location = document.getElementById('postLocation').value;
    const category = document.getElementById('postCategory').value;
    const image =
        document.getElementById('imagePreview').querySelector('img')?.src || '';

    const payload = {
        title,
        description,
        date,
        location,
        category,
        status: type,
        image
    };

    let url = "http://localhost/projetphp/create-post.php";

    // 🔥 MODE EDIT
    if (currentEditingPostId) {
        url = "http://localhost/projetphp/update-post.php";
        payload.id = currentEditingPostId;
    }

    fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(() => {
        fetchPosts();
        closeModal('postModal');
        resetPostForm();
    })
    .catch(err => console.error(err));
}

// Save Account
function saveAccount() {
    const name = document.getElementById('editName').value.trim();
    const email = document.getElementById('editEmail').value.trim();
    const phone = document.getElementById('editPhone').value.trim();

    if (!name || !email || !phone) {
        alert('Please fill in all fields');
        return;
    }

    fetch("http://localhost/projetphp/update-user.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
            name,
            email,
            phone,
            avatar: userData.avatar
        })
    })
    .then(res => res.json())
    .then(res => {
        alert(res.msg);

        if (res.msg === "updated") {
            userData.name = name;
            userData.email = email;
            userData.phone = phone;
            

            updateHeader();
            closeModal('accountModal');
        }
    })
    .catch(err => {
        console.error(err);
        alert("Server error");
    });
}

// Update Header
function updateHeader() {
    document.getElementById('userName').textContent = userData.name;
    document.getElementById('userEmail').textContent = userData.email;
    document.getElementById('userPhone').textContent = userData.phone;

    const userAvatar = document.getElementById('userAvatar');
    if (userData.avatar) {
        userAvatar.innerHTML = `<img src="${userData.avatar}" alt="avatar">`;
    }

    const profileAvatar = document.getElementById('profileAvatar');
    if (userData.avatar) {
        profileAvatar.innerHTML = `<img src="${userData.avatar}" alt="profile">`;
    }
}

// Modal Functions
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function resetPostForm() {
    
    document.getElementById('typeLost').checked = true;
    document.getElementById('postTitle').value = '';
    document.getElementById('postDescription').value = '';
    document.getElementById('postDate').value = '';
    document.getElementById('postLocation').value = '';
    document.getElementById('postCategory').value = 'Electronics';
    document.getElementById('imagePreview').innerHTML = '<i class="fas fa-image" style="font-size: 32px; color: #bdc3c7;"></i>';
    currentEditingPostId = null;
}

// Event Listeners
function setupEventListeners() {

    // Close Post Modal
    document.getElementById('closePostModal').addEventListener('click', () => {
        closeModal('postModal');
        resetPostForm();
    });

    document.getElementById('cancelPostBtn').addEventListener('click', () => {
        closeModal('postModal');
        resetPostForm();
    });

    document.getElementById('savePostBtn').addEventListener('click', savePost);

    // Image Upload
    document.getElementById('uploadTrigger').addEventListener('click', () => {
        document.getElementById('imageInput').click();
    });

    document.getElementById('imageInput').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const preview = document.getElementById('imagePreview');
                preview.innerHTML = `<img src="${event.target.result}" alt="preview">`;
            };
            reader.readAsDataURL(file);
        }
    });

    // Edit Account
    document.getElementById('editAccountBtn').addEventListener('click', () => {
        document.getElementById('editName').value = userData.name;
        document.getElementById('editEmail').value = userData.email;
        document.getElementById('editPhone').value = userData.phone;
        openModal('accountModal');
    });

    // Close Account Modal
    document.getElementById('closeAccountModal').addEventListener('click', () => {
        closeModal('accountModal');
    });

    document.getElementById('cancelAccountBtn').addEventListener('click', () => {
        closeModal('accountModal');
    });

    document.getElementById('saveAccountBtn').addEventListener('click', saveAccount);

    // Profile Image Upload
    document.getElementById('cameraBtn').addEventListener('click', () => {
        document.getElementById('profileImageInput').click();
    });

    document.getElementById('profileImageInput').addEventListener('change', (e) => {
    const file = e.target.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = (event) => {

            // 🔥 1. stocker l'image dans le state
            userData.avatar = event.target.result;

            // 🔥 2. afficher directement dans le UI
            const profileAvatar = document.getElementById('profileAvatar');
            profileAvatar.innerHTML = `<img src="${event.target.result}" alt="profile">`;
        };

        reader.readAsDataURL(file);
    }
});

    // Close modals when clicking outside
    document.getElementById('postModal').addEventListener('click', (e) => {
        if (e.target.id === 'postModal') {
            closeModal('postModal');
            resetPostForm();
        }
    });

    document.getElementById('accountModal').addEventListener('click', (e) => {
        if (e.target.id === 'accountModal') {
            closeModal('accountModal');
        }
    });
}

// Start
init();
