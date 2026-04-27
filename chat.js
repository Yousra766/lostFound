// DOM Elements
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const chatMessages = document.getElementById('chatMessages');
const attachmentBtn = document.getElementById('attachmentBtn');
const imageInput = document.getElementById('imageInput');
const emojiBtn = document.getElementById('emojiBtn');
const emojiPicker = document.getElementById('emojiPicker');
const callBtn = document.querySelector('.call-btn');
const callModal = document.getElementById('callModal');
const endCallBtn = document.querySelector('.end-call-btn');
const emojis = document.querySelectorAll('.emoji');

// Event Listeners
sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

attachmentBtn.addEventListener('click', () => {
    imageInput.click();
});

imageInput.addEventListener('change', handleImageUpload);

emojiBtn.addEventListener('click', toggleEmojiPicker);

emojis.forEach(emoji => {
    emoji.addEventListener('click', insertEmoji);
});

callBtn.addEventListener('click', startCall);
endCallBtn.addEventListener('click', endCall);

// Close emoji picker when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.emoji-btn') && !e.target.closest('.emoji-picker')) {
        emojiPicker.style.display = 'none';
    }
});

// Functions

function getCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}

function createMessageElement(text, isUser, isImage = false) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', isUser ? 'user' : 'other');

    const bubble = document.createElement('div');
    bubble.classList.add('message-bubble');

    if (isImage) {
        const img = document.createElement('img');
        img.src = text;
        img.classList.add('message-image');
        bubble.appendChild(img);
    } else {
        bubble.textContent = text;
    }

    const footer = document.createElement('div');
    footer.classList.add('message-footer');

    const timestamp = document.createElement('span');
    timestamp.classList.add('timestamp');
    timestamp.textContent = getCurrentTime();

    const statusCheck = document.createElement('span');
    statusCheck.classList.add('status-check');
    statusCheck.textContent = isUser ? '✓' : '✓✓';

    footer.appendChild(timestamp);
    footer.appendChild(statusCheck);

    messageDiv.appendChild(bubble);
    messageDiv.appendChild(footer);

    return messageDiv;
}

function sendMessage() {
    const message = messageInput.value.trim();

    if (message === '') return;

    // Add user message
    const userMessage = createMessageElement(message, true);
    chatMessages.appendChild(userMessage);
    messageInput.value = '';

    // Auto-scroll to latest message
    scrollToBottom();

    // Simulate response after a delay
    setTimeout(() => {
        const response = generateResponse(message);
        const otherMessage = createMessageElement(response, false);
        chatMessages.appendChild(otherMessage);
        scrollToBottom();
    }, 500);
}

function handleImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const imageUrl = event.target.result;
            const userMessage = createMessageElement(imageUrl, true, true);
            chatMessages.appendChild(userMessage);
            scrollToBottom();

            // Simulate response
            setTimeout(() => {
                const response = generateResponse('image');
                const otherMessage = createMessageElement(response, false);
                chatMessages.appendChild(otherMessage);
                scrollToBottom();
            }, 500);
        };
        reader.readAsDataURL(file);
    }

    // Reset input
    imageInput.value = '';
}

function toggleEmojiPicker() {
    if (emojiPicker.style.display === 'none') {
        emojiPicker.style.display = 'block';
    } else {
        emojiPicker.style.display = 'none';
    }
}

function insertEmoji(e) {
    const emoji = e.target.getAttribute('data-emoji');
    messageInput.value += emoji;
    messageInput.focus();
    emojiPicker.style.display = 'none';
}

function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function startCall() {
    callModal.style.display = 'flex';
}

function endCall() {
    callModal.style.display = 'none';
}

function generateResponse(userMessage) {
    const responses = [
        'That sounds great!',
        'when would you like to meet to pick it up?',
        'Let me check on that...',
        'Sounds perfect!',
        'Thanks for letting me know!',
        'I will get back to you on that!',
        'No problem, I can help!',
        'That works for me!',
        'i saw you post about a lost item',
        'Absolutely!',
        'Got it! 👍'
    ];

    if (userMessage.toLowerCase().includes('thank') || userMessage.toLowerCase().includes('thanks')) {
        return "You're welcome! 😊";
    }

    if (userMessage.toLowerCase().includes('how are you') || userMessage.toLowerCase().includes('how r u')) {
        return "I'm doing great, thanks for asking!";
    }

    if (userMessage.toLowerCase().includes('when would you like to meet to pick it up?') || userMessage.toLowerCase().includes('meet')) {
        return "would tomorrow afternoon good for you ?";
    }
    if (userMessage.toLowerCase().includes('hello,think the item you posted about might be mine.') || userMessage.toLowerCase().includes('be mine')) {
        return "Hello! , yes of course , can you tell me what it looks like so i can confirm it's yours ?";
    }
    if (userMessage.toLowerCase().includes('it is a black wallet with a small silver zipper and my ID inside') || userMessage.toLowerCase().includes('black')) {
        return "yes , that matches what i found! ";
    }
    if (userMessage.toLowerCase().includes('when would you like to meet to pick it up ?') || userMessage.toLowerCase().includes('meet')) {
        return "Would tomorrow afternoon good for you?";
    }
    if (userMessage.toLowerCase().includes('Yes, tomorrow works good , we can meet around 3PM if that"s okey') || userMessage.toLowerCase().includes('tomorrow')) {
        return "yes! GREAT";
    }
    if (userMessage === 'image') {
        return "yes it's the same item ! ";
    }

    return responses[Math.floor(Math.random() * responses.length)];
}
