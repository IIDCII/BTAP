const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

app.use(express.json());

app.post ('/api/openai', async (req, res) => {
    try {
        const {message} = req.body;

        const response  = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: "gpt-4",
                messages: [
                    {
                        role: "system",
                        content: "enter the prompt engineering here"
                    },
                    {
                        role: "user",
                        content: message
                    }
                ],
                max_tokens: 1000
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        )

    } catch (error) {
        console.error(error);
    }
});