const chatBox = document.getElementById("chat");
const input = document.getElementById("messageInput");

function addMessage(text, type) {
  const div = document.createElement("div");
  div.className = type;
  div.innerText = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const message = input.value;
  if (!message) return;

  addMessage(message, "user");
  input.value = "";

  try {
    const res = await fetch("http://localhost:5000/api/v1/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    const data = await res.json();

    addMessage(data.data.text, "bot");

    // suggestions (optionnel)
    if (data.data.suggestions) {
      data.data.suggestions.forEach(b => {
        addMessage("🍽️ " + b.name + " - " + b.description, "bot");
      });
    }

  } catch (err) {
    addMessage("❌ Erreur serveur", "bot");
  }
}
function isGreeting(msg) {
  return /^(hello|hi|hey|bonjour|salut|hola|salam)\b/i.test(msg.trim());
}
// Enter key support
input.addEventListener("keypress", function(e) {
  if (e.key === "Enter") sendMessage();
});