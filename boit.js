// ============================================
// CONVERSATION DATA
// ============================================

const conversations = {
  1: {
    name: 'Senouci yousra',
    handle: '@Senouci_yousra',
    messages: [
      { type: 'sent', text: 'Good morning , i saw your post about a found item', time: '09:25' },
      { type: 'received', text: 'Hi , can you describe it please.', time: '09:25' },
      { type: 'sent', text: 'Black wallet with my ID inside . :)', time: '09:25' },
      { type: 'received', text: 'Yes i found it yesterday .', time: '09:25' }
    ],
    replies: [
      'Of course!',
      'Sure, no problem.',
      'Thank you!',
      'That sounds great!',
      'I appreciate it!',
      'Perfect!',
      'Let me know.'
    ]
  },
  2: {
    name: 'Selka sara',
    handle: '@Selka_sara',
    messages: [
      { type: 'sent', text: 'Hey, how are you?', time: '12:15' },
      { type: 'received', text: 'I\'m good! How about you?', time: '12:16' },
      { type: 'sent', text: 'All good! working on the project', time: '12:17' }
    ],
    replies: [
      'Nice!',
      'Great to hear!',
      'Awesome!',
      'Thanks for asking!',
      'Doing well!',
      'All good here!',
      'Same here!'
    ]
  },
  3: {
    name: 'Touil yousra',
    handle: '@Touil_yousra',
    messages: [
      { type: 'sent', text: 'Hi there!', time: '12:45' },
      { type: 'received', text: 'Hello! How can I help?', time: '12:46' },
      { type: 'sent', text: 'Just wanted to catch up', time: '12:47' },
      { type: 'received', text: 'Sounds good! Let\'s talk soon', time: '12:48' }
    ],
    replies: [
      'Absolutely!',
      'For sure!',
      'Definitely!',
      'Sounds perfect!',
      'Let\'s do it!',
      'I\'m in!',
      'Count me in!'
    ]
  },
  4: {
    name: 'Sahari fatima',
    handle: '@Sahari_fatima',
    messages: [
      { type: 'sent', text: 'Hello!', time: '13:00' },
      { type: 'received', text: 'Hi! Nice to hear from you!', time: '13:01' },
      { type: 'sent', text: 'How\'s everything?', time: '13:02' }
    ],
    replies: [
      'Everything\'s great!',
      'All\'s well!',
      'Couldn\'t be better!',
      'Things are good!',
      'No complaints!',
      'Living the dream!',
      'Pretty awesome!'
    ]
  }
};

// ============================================
// STATE
// ============================================

let currentContactId = 1;
let messageHistory = {};

// Initialize message history
Object.keys(conversations).forEach(id => {
  messageHistory[id] = [...conversations[id].messages];
});

// ============================================
// DOM ELEMENTS
// ============================================

const contactItems = document.querySelectorAll('.contact-item');
const messagesList = document.getElementById('messagesList');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.querySelector('.send-btn');
const callBtn = document.querySelector('.call-btn');
const videoBtn = document.querySelector('.video-btn');
const viewProfileBtn = document.querySelector('.view-profile-btn');
const emojiBtn = document.querySelector('.emoji-btn');
const attachmentBtn = document.querySelector('.attachment-btn');
const fileInput = document.getElementById('fileInput');
const imageIcon = document.querySelector('.image-icon');
const searchInput = document.querySelector('.search-input');
const emojiPicker = document.getElementById('emojiPicker');
const emojis = document.querySelectorAll('.emoji');
const messagesContainer = document.querySelector('.messages-container');

const callModal = document.getElementById('callModal');
const videoModal = document.getElementById('videoModal');
const profileModal = document.getElementById('profileModal');
const modalOverlay = document.getElementById('modalOverlay');

const callModalName = document.getElementById('callModalName');
const videoModalName = document.getElementById('videoModalName');
const profileName = document.getElementById('profileName');
const profileHandle = document.getElementById('profileHandle');

const topbarName = document.querySelector('.contact-display-name');
const topbarHandle = document.querySelector('.handle');

// ============================================
// UTILITY FUNCTIONS
// ============================================

function getCurrentTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

function scrollToBottom() {
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function renderMessages() {
  messagesList.innerHTML = '';
  
  const messages = messageHistory[currentContactId];
  
  messages.forEach(msg => {
    const messageEl = document.createElement('div');
    messageEl.className = `message ${msg.type}`;
    
    const bubbleContent = msg.isImage 
      ? `<img src="${msg.text}" alt="Image">` 
      : (msg.isFile 
        ? `<i class="fas fa-file"></i> ${msg.text}` 
        : msg.text);
    
    messageEl.innerHTML = `
      <div>
        <div class="message-bubble">${bubbleContent}</div>
        <div class="message-time">
          ${msg.time}
          <i class="fas fa-check-double"></i>
        </div>
      </div>
    `;
    
    messagesList.appendChild(messageEl);
  });
  
  scrollToBottom();
}

function setActiveContact(contactId) {
  // Remove active class from all contacts
  contactItems.forEach(item => item.classList.remove('active'));
  
  // Add active class to clicked contact
  const activeContact = document.querySelector(`[data-contact-id="${contactId}"]`);
  activeContact.classList.add('active');
  
  // Clear unread badge for this contact
  const badge = activeContact.querySelector('.unread-badge');
  if (badge) {
    badge.style.display = 'none';
  }
  
  // Update current contact
  currentContactId = contactId;
  
  // Update topbar
  const contactData = conversations[contactId];
  topbarName.textContent = contactData.name;
  topbarHandle.textContent = contactData.handle;
  
  // Render messages
  renderMessages();
}

function addMessage(text, type = 'sent', contactId = null, options = {}) {
  const time = getCurrentTime();
  const targetContactId = contactId || currentContactId;
  const message = { type, text, time, isImage: options.isImage || false, isFile: options.isFile || false };
  
  messageHistory[targetContactId].push(message);
  
  // Only render if this is the current contact
  if (targetContactId === currentContactId) {
    const bubbleContent = message.isImage 
      ? `<img src="${text}" alt="Image">` 
      : (message.isFile 
        ? `<i class="fas fa-file"></i> ${text}` 
        : text);
    
    const messageEl = document.createElement('div');
    messageEl.className = `message ${type}`;
    
    messageEl.innerHTML = `
      <div>
        <div class="message-bubble">${bubbleContent}</div>
        <div class="message-time">
          ${time}
          <i class="fas fa-check-double"></i>
        </div>
      </div>
    `;
    
    messagesList.appendChild(messageEl);
    scrollToBottom();
  } else if (type === 'received') {
    // Add badge to background conversation
    const contactItem = document.querySelector(`[data-contact-id="${targetContactId}"]`);
    if (contactItem) {
      let badge = contactItem.querySelector('.unread-badge');
      if (!badge) {
        badge = document.createElement('div');
        badge.className = 'unread-badge';
        contactItem.appendChild(badge);
      }
      badge.style.display = 'flex';
      const count = parseInt(badge.textContent) || 0;
      badge.textContent = count + 1;
    }
  }
}

function sendMessage() {
  const text = messageInput.value.trim();
  
  if (!text) return;
  
  // Add sent message
  addMessage(text, 'sent');
  messageInput.value = '';
  
  // Simulate received reply after 1 second
  setTimeout(() => {
    const contactData = conversations[currentContactId];
    const randomReply = contactData.replies[Math.floor(Math.random() * contactData.replies.length)];
    addMessage(randomReply, 'received', currentContactId);
  }, 1000);
}

// ============================================
// MODAL FUNCTIONS
// ============================================

function showModal(modal) {
  modalOverlay.classList.add('active');
  modal.classList.add('active');
}

function hideModal(modal) {
  modal.classList.remove('active');
  
  // Hide overlay if no modals are open
  const activeModals = document.querySelectorAll('.modal.active');
  if (activeModals.length === 0) {
    modalOverlay.classList.remove('active');
  }
}

function hideAllModals() {
  document.querySelectorAll('.modal').forEach(modal => {
    modal.classList.remove('active');
  });
  modalOverlay.classList.remove('active');
}

// ============================================
// EVENT LISTENERS
// ============================================

// Contact switching
contactItems.forEach(item => {
  item.addEventListener('click', () => {
    const contactId = parseInt(item.getAttribute('data-contact-id'));
    setActiveContact(contactId);
  });
});

// Message sending
messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendMessage();
  }
});

sendBtn.addEventListener('click', sendMessage);

// Call modal
callBtn.addEventListener('click', () => {
  callModalName.textContent = conversations[currentContactId].name;
  showModal(callModal);
});

// Video modal
videoBtn.addEventListener('click', () => {
  videoModalName.textContent = conversations[currentContactId].name;
  showModal(videoModal);
});

// Call/Video modal buttons
document.querySelectorAll('.answer-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    hideAllModals();
  });
});

document.querySelectorAll('.decline-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    hideAllModals();
  });
});

// View Profile
viewProfileBtn.addEventListener('click', () => {
  const contactData = conversations[currentContactId];
  profileName.textContent = contactData.name;
  profileHandle.textContent = contactData.handle;
  showModal(profileModal);
});

// Close profile modal
document.querySelector('.close-btn').addEventListener('click', () => {
  hideModal(profileModal);
});

// Modal overlay click to close
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) {
    hideAllModals();
  }
});

// Emoji Picker
emojiBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  emojiPicker.classList.toggle('active');
});

emojis.forEach(emoji => {
  emoji.addEventListener('click', (e) => {
    const emojiChar = e.target.getAttribute('data-emoji');
    
    // Insert emoji at cursor position
    const start = messageInput.selectionStart;
    const end = messageInput.selectionEnd;
    const text = messageInput.value;
    
    messageInput.value = text.substring(0, start) + emojiChar + text.substring(end);
    
    // Move cursor after emoji
    messageInput.selectionStart = messageInput.selectionEnd = start + emojiChar.length;
    messageInput.focus();
  });
});

// Close emoji picker when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.input-bar')) {
    emojiPicker.classList.remove('active');
  }
});

// Attachment
attachmentBtn.addEventListener('click', () => {
  fileInput.click();
});

fileInput.addEventListener('change', (e) => {
  if (e.target.files && e.target.files[0]) {
    const file = e.target.files[0];
    const fileName = file.name;
    const isImage = /\.(png|jpg|jpeg|gif|webp)$/i.test(fileName);
    
    if (isImage) {
      const reader = new FileReader();
      reader.onload = (event) => {
        addMessage(event.target.result, 'sent', currentContactId, { isImage: true });
        messageInput.value = '';
        setTimeout(() => {
          const contactData = conversations[currentContactId];
          const randomReply = contactData.replies[Math.floor(Math.random() * contactData.replies.length)];
          addMessage(randomReply, 'received', currentContactId);
        }, 1000);
      };
      reader.readAsDataURL(file);
    } else {
      addMessage(fileName, 'sent', currentContactId, { isFile: true });
      messageInput.value = '';
      setTimeout(() => {
        addMessage('Thanks for the file!', 'received', currentContactId);
      }, 1000);
    }
  }
  // Reset file input
  fileInput.value = '';
});

// Image icon click
imageIcon.addEventListener('click', () => {
  fileInput.click();
});

// Search functionality
searchInput.addEventListener('input', (e) => {
  const searchText = e.target.value.toLowerCase();
  
  contactItems.forEach(item => {
    const name = item.querySelector('.contact-name').textContent.toLowerCase();
    if (name.includes(searchText)) {
      item.style.display = '';
    } else {
      item.style.display = 'none';
    }
  });
});

// Focus on input for better UX
messageInput.focus();

// ============================================
// INITIALIZATION
// ============================================

// Set first contact as active on page load
setActiveContact(1);
