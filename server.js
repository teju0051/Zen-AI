const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Hugging Face API details
const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;
const MODEL_URL = 'https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill';

// Route to handle chat messages
app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;
  console.log('Received message from client:', userMessage);

  try {
    // Call Hugging Face API
    const apiResponse = await axios.post(
      MODEL_URL,
      { inputs: userMessage },
      { headers: { Authorization: `Bearer ${HUGGING_FACE_API_KEY}` } }
    );

    // Log the full API response for debugging
    console.log('Hugging Face API Response:', JSON.stringify(apiResponse.data, null, 2));

   // Correctly extract the bot response from the Hugging Face API response
const botResponse = apiResponse.data[0].generated_text || "I'm sorry, I couldn't generate a response.";

    
    // Log response that will be sent to frontend
    console.log('Sending response to client:', botResponse);

    // Send the bot response back to the frontend
    res.json({ response: botResponse });
  } catch (error) {
    console.error('Error with Hugging Face API:', error.message);
    res.status(500).json({ response: 'Error communicating with the chatbot. Please try again later.' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  
});

const cors = require('cors');
app.use(cors()); // Allow all origins (you can restrict this in production)
