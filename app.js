// app.js - Node.js server to handle Dialogflow integration
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const dialogflow = require('@google-cloud/dialogflow');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Configure Dialogflow client
const sessionClient = new dialogflow.SessionsClient({
  keyFilename: './mythical-stock-452814-s9-acee592fc44d.json'
});
const projectId = 'mythical-stock-452814-s9';

// API endpoint to process messages
app.post('/api/message', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    // Create a random session ID for the user
    const sessionId = Math.random().toString(36).substring(7);
    const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);
    
    // Create the request for Dialogflow
    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: message,
          languageCode: 'en-US',
        },
      },
    };
    
    // Process the request
    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;
    
    // Return the response
    res.json({
      fulfillmentText: result.fulfillmentText,
      intentDetected: result.intent.displayName,
      confidence: result.intentDetectionConfidence
    });
  } catch (error) {
    console.error('Error processing message:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/main', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'main.html'));
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});