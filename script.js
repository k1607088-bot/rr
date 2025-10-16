// PWA Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
                updateStatus('✅ Service Worker Active');
            })
            .catch(error => {
                console.log('SW registration failed: ', error);
                updateStatus('❌ Service Worker Failed');
            });
    });
}

// Install Prompt
let deferredPrompt;
const installBtn = document.getElementById('installBtn');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.style.display = 'inline-block';
});

installBtn.addEventListener('click', async () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log('User response to the install prompt:', outcome);
        deferredPrompt = null;
        installBtn.style.display = 'none';
    }
});

// Offline Detection
window.addEventListener('online', () => updateStatus('🟢 Online'));
window.addEventListener('offline', () => updateStatus('🔴 Offline'));

function updateStatus(message) {
    document.getElementById('status').innerHTML = `<strong>${message}</strong>`;
}

// Counter Functionality
let count = 0;
const counterSpan = document.getElementById('counter');
const incrementBtn = document.getElementById('increment');

function updateCounter() {
    counterSpan.textContent = count;
    localStorage.setItem('counter', count);
}

incrementBtn.addEventListener('click', () => {
    count++;
    updateCounter();
});

// Load saved counter
count = parseInt(localStorage.getItem('counter')) || 0;
updateCounter();

// Note Storage
const saveBtn = document.getElementById('saveBtn');
const noteInput = document.getElementById('noteInput');
const savedNote = document.getElementById('savedNote');

function loadNote() {
    const saved = localStorage.getItem('note') || '';
    noteInput.value = saved;
    savedNote.textContent = saved ? `Saved: "${saved}"` : 'No note saved';
}

saveBtn.addEventListener('click', () => {
    const note = noteInput.value.trim();
    localStorage.setItem('note', note);
    savedNote.textContent = note ? `Saved: "${note}"` : 'No note saved';
});

// Load saved note on start
loadNote();

// Initial status
updateStatus('🔄 Initializing...');
setTimeout(() => {
    const isOnline = navigator.onLine ? '🟢 Online' : '🔴 Offline';
    updateStatus(isOnline);
}, 100);
