const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateReview(month, year, activities, healthData) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", apiVersion: "v1" });
  
        const prompt = `
            Generate an analysis for ${month} ${year} based on the following:
            Activities: ${JSON.stringify(activities)}
            Health Data: ${JSON.stringify(healthData)}
    
            Provide insights for:
            - Health advice
            - Exercise recommendation
            - Hobby suggestion
            - Entertainment (movies/videos) suggestion
    
            Respond **only** with a JSON object, with some brief additional text or explanations.
    
            Expected JSON format:
            {
            "health": "Eat more greens and hydrate well.",
            "exercise": "Try daily cardio for 30 minutes.",
            "hobby": "Learn a new instrument.",
            "entertainment": "Since you're into this hobby/exercise/health you should checkout this documentary/movie/video..."
            }
        `;
        console.log("Sending request to Gemini...");
        const response = await Promise.race([
            model.generateContent({ contents: [{ parts: [{ text: prompt }] }] }),
            new Promise((_, reject) => setTimeout(() => reject(new Error("AI Timeout")), 10000)) // 10 sec timeout
        ]);
        console.log("Received AI response:", response);

    
        let aiData = response.response.candidates[0].content.parts[0].text;
    
        // **Fix: Remove unwanted markdown formatting**
        aiData = aiData.replace(/```json|```/g, "").trim();
    
        return JSON.parse(aiData);
        } catch (error) {
        console.error("Gemini AI Error:", error);
        return null;
        }
    }

async function generatePrompt(prompt){
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", apiVersion: "v1" });
  
        const response = await Promise.race([
            model.generateContent({ contents: [{ parts: [{ text: prompt }] }] }),
            new Promise((_, reject) => setTimeout(() => reject(new Error("AI Timeout")), 10000)) // 10 sec timeout
        ]);
        console.log("Received AI response:", response);

        let aiData = response.response.candidates[0].content.parts[0].text;
    
        // **Fix: Remove unwanted markdown formatting**
        aiData = aiData.replace(/```json|```/g, "").trim();
    
        return aiData;
        } catch (error) {
        console.error("Gemini AI Error:", error);
        return null;
        }
}
    
module.exports = { generateReview, generatePrompt };