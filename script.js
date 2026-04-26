lucide.createIcons();

const chatContainer = document.getElementById('chat-container');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const settingsTrigger = document.getElementById('settings-trigger');
const settingsModal = document.getElementById('settings-modal');
const saveKeyBtn = document.getElementById('save-key-btn');
const apiKeyInput = document.getElementById('api-key-input');
const closeModal = document.getElementById('close-modal');

let OPENAI_API_KEY = localStorage.getItem('dipx_key') || '';
if (OPENAI_API_KEY) apiKeyInput.value = OPENAI_API_KEY;

settingsTrigger.onclick = () => settingsModal.classList.remove('hidden');
closeModal.onclick = () => settingsModal.classList.add('hidden');

saveKeyBtn.onclick = () => {
    OPENAI_API_KEY = apiKeyInput.value;
    localStorage.setItem('dipx_key', OPENAI_API_KEY);
    settingsModal.classList.add('hidden');
};

function addMessage(text, isUser = false) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;
    msgDiv.textContent = text;
    chatContainer.appendChild(msgDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

async function handleChat() {
    const query = userInput.value.trim();
    if (!query || !OPENAI_API_KEY) return;

    addMessage(query, true);
    userInput.value = '';

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENAI_API_KEY}` },
            body: JSON.stringify({ model: "gpt-3.5-turbo", messages: [{ role: "user", content: query }] })
        });
        const data = await response.json();
        addMessage(data.choices[0].message.content);
    } catch (e) {
        addMessage("CONNECTION ERROR: Uplink failed.");
    }
}

sendBtn.onclick = handleChat;
userInput.onkeypress = (e) => { if(e.key === 'Enter') handleChat(); };
