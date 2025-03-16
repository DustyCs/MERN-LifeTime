const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { generatePrompt } = require("../utils/geminiService");

const router = express.Router();


// Send a request to gemini ai 

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { prompt } = req.body;
    const response = await generatePrompt(prompt);
    res.json(response);
  } catch (error) {
    console.error("Gemini AI Error:", error);
    res.status(500).json({ msg: "Server Error - attempting to generate prompt" });
  }
});

module.exports = router;
