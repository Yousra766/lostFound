// Get form elements
const reportForm = document.getElementById('reportForm');
const cancelBtn = document.getElementById('cancelBtn');
const photoInput = document.getElementById('photo');
const fileInputWrapper = document.querySelector('.file-input-wrapper');

reportForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const itemType = document.getElementById('itemType').value.trim();
    const category = document.getElementById('category').value;
    const date = document.getElementById('date').value;
    const location = document.getElementById('location').value.trim();
    const description = document.getElementById('description').value.trim();
    const photo = photoInput.files[0];

    // Validation
    if (!itemType || !category || !date || !location || !description) {
        alert('Please fill all fields');
        return;
    }

    if (photo) {
        const maxFileSize = 5 * 1024 * 1024;
        if (photo.size > maxFileSize) {
            alert('File size must be less than 5MB');
            return;
        }
    }

    const params = new URLSearchParams(window.location.search);
    let status = params.get("status") || "lost";

    const formData = new FormData();
    formData.append("itemType", itemType);
    formData.append("category", category);
    formData.append("date", date);
    formData.append("location", location);
    formData.append("description", description);
    formData.append("status", status);
    if (photo) {
        formData.append("photo", photo);
    }

    fetch("formulaire.php", {
        method: "POST",
        credentials: "include",
        body: formData
    })
    .then(res => res.json())
    .then(res => {
        if (res.msg.toLowerCase().includes("success")) {
            alert("Your report has been submitted successfully.");

            // LOGIQUE DE MATCHING
            // On encode les valeurs pour l'URL
            const searchVal = encodeURIComponent(itemType);
            const catVal = encodeURIComponent(category);
            const locVal = encodeURIComponent(location);

            if (status === "lost") {
                // J'ai perdu -> Je cherche dans les objets TROUVÉS (found.html)
                window.location.href = `found.html?search=${searchVal}&category=${catVal}&location=${locVal}`;
            } else {
                // J'ai trouvé -> Je cherche dans les objets PERDUS (lost.html)
                window.location.href = `lost.html?search=${searchVal}&category=${catVal}&location=${locVal}`;
            }
        } else {
            alert(res.msg);
        }
    })
    .catch(err => console.error(err));
});

// Le reste de ton code (Cancel, File input, Drag&Drop) reste identique
cancelBtn.addEventListener('click', function() {
    reportForm.reset();
    fileInputWrapper.classList.remove('has-file');
});

photoInput.addEventListener('change', function() {
    if (this.files.length > 0) {
        fileInputWrapper.classList.add('has-file');
    } else {
        fileInputWrapper.classList.remove('has-file');
    }
});

fileInputWrapper.addEventListener('dragover', e => { e.preventDefault(); fileInputWrapper.style.backgroundColor = '#c8c8c8'; });
fileInputWrapper.addEventListener('dragleave', () => { fileInputWrapper.style.backgroundColor = ''; });
fileInputWrapper.addEventListener('drop', e => {
    e.preventDefault();
    fileInputWrapper.style.backgroundColor = '';
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith('image/')) {
        photoInput.files = files;
        fileInputWrapper.classList.add('has-file');
    }
});

document.querySelector('.file-input-label').addEventListener('click', () => photoInput.click());
const dateInput = document.getElementById('date');
dateInput.value = new Date().toISOString().split('T')[0];