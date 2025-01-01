const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("chat-input");
const sendBtn = document.getElementById("send-btn");

// Append a message to the chat box
function appendMessage(message, sender) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", sender);

    // Allow HTML for bot responses
    if (sender === "bot") {
        messageDiv.innerHTML = message; // Render HTML content for bot messages
    } else {
        messageDiv.textContent = message; // Plain text for user messages
    }

    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to the latest message
}

// Send a message
function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    // Append user message
    appendMessage(message, "user");

    // Clear input field
    userInput.value = "";

    console.log("Sending message to server:", message);

    // Send message to the server
    fetch("http://127.0.0.1:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
    })
        .then((response) => {
            console.log("Server response received:", response);

            if (!response.ok) {
                throw new Error(`Network response was not ok (status: ${response.status})`);
            }

            return response.json();
        })
        .then((data) => {
            console.log("Response data from server:", data);

            // Append bot response
            appendMessage(data.response, "bot");
        })
        .catch((error) => {
            console.error("Fetch Error:", error);

            // Append error message
            appendMessage(
                "Sorry, I couldn't connect to the server. Please try again later.",
                "bot"
            );
        });
}

// Event listener for the Enter key
userInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        sendMessage(); // Trigger the send message function when Enter is pressed
    }
});

// Optional: Trigger sendMessage when the button is clicked
sendBtn.addEventListener("click", sendMessage);
