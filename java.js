function sendMessage() {
  const input = document.getElementById('msgInput');
  const msg = input.value.trim();
  if (msg === "") return;

  const container = document.getElementById('messages');
  const div = document.createElement('div');
  div.className = 'message';
  div.textContent = msg;

  container.appendChild(div);
  input.value = "";
  container.scrollTop = container.scrollHeight;
}
