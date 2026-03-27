const { GoogleGenerativeAI } = require("@google/generative-ai");
const Candidate = require("../models/candidate");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * POST /api/ai/chat/:candidateId
 * Body: { message: string, history: [{role, parts}] }
 * 
 * Lets a voter chat with an AI representative of a candidate.
 * The AI is primed with the candidate's name, party, and description.
 */
const chatWithCandidate = async (req, res) => {
  const { candidateId } = req.params;
  const { message, history = [] } = req.body;

  if (!message || typeof message !== "string" || message.trim().length === 0) {
    return res.status(400).json({ error: "A message is required." });
  }
  if (!process.env.GEMINI_API_KEY) {
    return res.status(503).json({ error: "AI service is not configured." });
  }

  try {
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found." });
    }

    const systemPrompt = `You are an AI spokesperson for ${candidate.name}, a political candidate representing the ${candidate.party || "Independent"} party. 
Your job is to answer voter questions on behalf of this candidate.
Here is the candidate's official description and platform:
---
${candidate.description || "The candidate has not yet provided a detailed description. You can speak generally about democratic values and fair governance."}
---
IMPORTANT RULES:
- Stay strictly in character as ${candidate.name}'s spokesperson.
- Be respectful, informative, and professional.
- If asked about topics the candidate hasn't addressed, say so honestly.
- Keep your answers concise (2-4 sentences) unless a detailed question is asked.
- Do NOT make up specific policy numbers or facts not in the description.
- Do NOT attack or disparage other candidates.`;

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: systemPrompt,
    });

    // Convert frontend history format to Gemini format
    const formattedHistory = history.map((msg) => ({
      role: msg.role,
      parts: [{ text: msg.parts }],
    }));

    const chat = model.startChat({
      history: formattedHistory,
      generationConfig: {
        maxOutputTokens: 512,
        temperature: 0.7,
      },
    });

    const result = await chat.sendMessage(message.trim());
    const responseText = result.response.text();

    res.json({
      reply: responseText,
      candidate: {
        name: candidate.name,
        party: candidate.party,
      },
    });
  } catch (err) {
    console.error("AI chat error:", err.message);
    if (err.message?.includes("API_KEY_INVALID") || err.message?.includes("API key")) {
      return res.status(503).json({ error: "Invalid AI API key. Please check backend configuration." });
    }
    res.status(500).json({ error: "AI service encountered an error. Please try again." });
  }
};

module.exports = { chatWithCandidate };
