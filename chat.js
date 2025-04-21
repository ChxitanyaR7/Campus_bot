document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');

    // Add event listener for send button
    sendButton.addEventListener('click', sendMessage);
    
    // Add event listener for enter key
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Function to send message
    async function sendMessage() {
        const message = userInput.value.trim();
        
        if (!message) return;
        
        // Clear input field
        userInput.value = '';
        
        // Display user message
        appendMessage('user', message);
        
        // Show typing indicator
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'message bot typing';
        typingIndicator.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
        chatMessages.appendChild(typingIndicator);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        try {
            // Send message to server
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message })
            });
            
            // Remove typing indicator
            chatMessages.removeChild(typingIndicator);
            
            if (!response.ok) {
                throw new Error('Failed to get response from server');
            }
            
            const data = await response.json();
            
            // Display bot response
            appendMessage('bot', data.response);
            
        } catch (error) {
            console.error('Error sending message:', error);
            
            // Remove typing indicator
            if (typingIndicator.parentNode === chatMessages) {
                chatMessages.removeChild(typingIndicator);
            }
            
            // Display error message
            appendMessage('bot', 'Sorry, I encountered an error. Please try again later.');
        }
    }

    // Function to append message to chat
    function appendMessage(sender, message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        messageDiv.textContent = message;
        
        chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    // Example usage in your chat route handler
app.post('/api/chat', async (req, res) => {
    const userId = req.user.id; // Get from authenticated session
    const userMessage = req.body.message;

    // Save user message
    await saveChatMessage(userId, userMessage, false);

    // Get bot response
    const botResponse = await generateBotResponse(userMessage);

    // Save bot response
    await saveChatMessage(userId, botResponse, true);

    // Send response
    res.json({ response: botResponse });
});

// Get chat history endpoint
app.get('/api/chat/history', async (req, res) => {
    const userId = req.user.id; // Get from authenticated session
    const limit = parseInt(req.query.limit) || 50;

    const result = await getChatHistory(userId, limit);
    
    if (result.success) {
        res.json(result.messages);
    } else {
        res.status(500).json({ error: result.message });
    }
});

});