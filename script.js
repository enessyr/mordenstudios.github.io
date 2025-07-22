const messagesEl = document.getElementById('messages');
const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');

// OpenAI API anahtarınızı buraya yazınız
const OPENAI_API_KEY = 'YOUR_OPENAI_API_KEY_HERE';

async function sendMessageToAI(message) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'Sen matematik derslerinde yardımcı olan bilgili bir asistan olarak görev yapıyorsun.' },
        { role: 'user', content: message }
      ],
      max_tokens: 1000,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`Hata: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

function addMessage(text, className) {
  const div = document.createElement('div');
  div.classList.add('message', className);
  div.textContent = text;
  messagesEl.appendChild(div);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const userMessage = input.value.trim();
  if (!userMessage) return;

  addMessage(userMessage, 'user');
  input.value = '';
  addMessage('AI düşünürken...', 'bot');

  try {
    const aiResponse = await sendMessageToAI(userMessage);
    // "AI düşünürken..." mesajını kaldırıp cevabı ekle
    const loadingMsg = messagesEl.querySelector('.bot:last-child');
    if (loadingMsg) loadingMsg.remove();

    addMessage(aiResponse, 'bot');
  } catch (err) {
    const loadingMsg = messagesEl.querySelector('.bot:last-child');
    if (loadingMsg) loadingMsg.remove();

    addMessage('Üzgünüm, şu an cevap veremiyorum.', 'bot');
    console.error(err);
  }
});
