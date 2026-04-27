// Get form elements
const reportForm = document.getElementById('reportForm');
const cancelBtn = document.getElementById('cancelBtn');
const photoInput = document.getElementById('photo');
const fileInputWrapper = document.querySelector('.file-input-wrapper');

// Handle form submission
reportForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // Get form values
    const itemType = document.getElementById('itemType').value.trim();
    const category = document.getElementById('category').value;
    const date = document.getElementById('date').value;
    const location = document.getElementById('location').value.trim();
    const description = document.getElementById('description').value.trim();
    const photo = photoInput.files[0];

    // Validate all fields
    if (!itemType) {
        alert('Please enter an item type');
        return;
    }

    if (!category) {
        alert('Please select a category');
        return;
    }

    if (!date) {
        alert('Please select a date');
        return;
    }

    if (!location) {
        alert('Please enter a location');
        return;
    }

    if (!description) {
        alert('Please enter a description');
        return;
    }

    if (!photo) {
        alert('Please upload an item photo');
        return;
    }

    // Check file size (max 5MB)
    const maxFileSize = 5 * 1024 * 1024; // 5MB
    if (photo.size > maxFileSize) {
        alert('File size must be less than 5MB');
        return;
    }

    // If all validation passes
    console.log('[v0] Form submitted with data:', {
        itemType,
        category,
        date,
        location,
        description,
        photo: photo.name
    });

    alert(`Report submitted successfully!\n\nItem Type: ${itemType}\nCategory: ${category}\nDate: ${date}\nLocation: ${location}`);
    reportForm.reset();
    fileInputWrapper.classList.remove('has-file');
});

// Handle cancel button
cancelBtn.addEventListener('click', function() {
    if (reportForm.reportValidity()) {
        const isConfirmed = confirm('Are you sure you want to cancel? All data will be lost.');
        if (isConfirmed) {
            reportForm.reset();
            fileInputWrapper.classList.remove('has-file');
        }
    } else {
        reportForm.reset();
        fileInputWrapper.classList.remove('has-file');
    }
});

// Handle file input
photoInput.addEventListener('change', function() {
    if (this.files.length > 0) {
        fileInputWrapper.classList.add('has-file');
        const fileName = this.files[0].name;
        console.log('[v0] File selected:', fileName);
    } else {
        fileInputWrapper.classList.remove('has-file');
    }
});

// Handle drag and drop for file input
fileInputWrapper.addEventListener('dragover', function(e) {
    e.preventDefault();
    fileInputWrapper.style.backgroundColor = '#c8c8c8';
});

fileInputWrapper.addEventListener('dragleave', function() {
    fileInputWrapper.style.backgroundColor = '';
});

fileInputWrapper.addEventListener('drop', function(e) {
    e.preventDefault();
    fileInputWrapper.style.backgroundColor = '';

    const files = e.dataTransfer.files;
    if (files.length > 0) {
        const file = files[0];
        
        // Check if file is an image
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file');
            return;
        }

        // Create a DataTransfer object to set files
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        photoInput.files = dataTransfer.files;

        fileInputWrapper.classList.add('has-file');
        console.log('[v0] File dropped:', file.name);
    }
});

// Make file input clickable
document.querySelector('.file-input-label').addEventListener('click', function() {
    photoInput.click();
});

// Set today's date as default
const dateInput = document.getElementById('date');
const today = new Date().toISOString().split('T')[0];
dateInput.value = today;
