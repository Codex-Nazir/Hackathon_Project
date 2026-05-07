const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const parseCertificateText = async (text) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
        You are an AI specialized in parsing extracted OCR text from certificates. 
        Analyze the following text and extract the details in a structured JSON format.
        
        Fields to extract:
        - studentName
        - course
        - organization
        - certificateId
        - issueDate (format as YYYY-MM-DD if possible)

        Text to parse:
        "${text}"

        Return ONLY the JSON object. Do not include any explanation or markdown code blocks.
        If a field is not found, use null.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const jsonText = response.text().replace(/```json|```/g, "").trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("AI Parsing Error:", error);
        return null;
    }
};

const explainFraud = async (extractedData, dbData) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
        Compare the following two datasets:
        1. Extracted from Certificate (OCR): ${JSON.stringify(extractedData)}
        2. Original Record (Database): ${JSON.stringify(dbData)}

        Identify any discrepancies or signs of tampering. Provide a concise, professional explanation for why the certificate is valid or suspicious.
        Return a JSON object with:
        - status (valid/suspicious)
        - trustScore (0-100)
        - explanation (string)
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const jsonText = response.text().replace(/```json|```/g, "").trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("AI Explanation Error:", error);
        return { status: "error", explanation: "Failed to analyze authenticity." };
    }
};

module.exports = { parseCertificateText, explainFraud };
