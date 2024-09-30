const dotenv = require('dotenv');
dotenv.config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Setup server
const app = express();
app.use(bodyParser.json());
app.use(cors());

// endpoint for ChatGPT
app.post("/chat", async (req, res) => {
  const { prompt } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1000,
      temperature: 0,
    });
    res.send(completion.choices[0].message.content);
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    res.status(500).send("Error processing your request");
  }
});

const PORT = 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});