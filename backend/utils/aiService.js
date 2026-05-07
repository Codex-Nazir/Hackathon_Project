const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

// Rule-based parser as a reliable backup/primary method
const regexParse = (text) => {
    const data = {
        studentName: null,
        course: null,
        organization: null,
        certificateId: null,
        issueDate: null
    };

    try {
        // Normalize text for easier matching
        const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);

        // Extract Certificate ID
        const idMatch = text.match(/Certificate ID:\s*(\S+)/i);
        if (idMatch) data.certificateId = idMatch[1];

        // Extract Date
        const dateMatch = text.match(/Issue Date:\s*(\d{1,2}\/\d{1,2}\/\d{4})/i);
        if (dateMatch) data.issueDate = dateMatch[1];

        // Template-specific line parsing
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].toLowerCase();
            
            if (line.includes("certify that")) {
                data.studentName = lines[i + 1]; 
            }
            if (line.includes("completed the course")) {
                data.course = lines[i + 1];
            }
            // Better Organization extraction: Look for "at " after the course line
            if (line.startsWith("at ") && i > 0) {
                data.organization = lines[i].replace(/^at\s+/i, "").trim();
            }
        }

        return data;
    } catch (e) {
        console.error("Regex Parsing Error:", e);
        return data;
    }
};

const parseCertificateText = async (text) => {
    // 1. Try Regex First
    const baseData = regexParse(text);
    
    // 2. Try Gemini to refine (if key works)
    try {
        const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
        const payload = {
            contents: [{
                parts: [{
                    text: `Analyze this certificate text and extract details in JSON:
                    Fields: studentName, course, organization, certificateId, issueDate.
                    Text: "${text}"
                    Return ONLY JSON.`
                }]
            }]
        };

        const response = await axios.post(url, payload, { timeout: 3000 });
        const resultText = response.data.candidates[0].content.parts[0].text;
        const aiData = JSON.parse(resultText.replace(/```json|```/g, "").trim());
        return { ...baseData, ...aiData };
    } catch (error) {
        return baseData;
    }
};

const explainFraud = async (extractedData, dbData) => {
    const differences = [];
    let trustScore = 100;

    // Helper for case-insensitive comparison
    const compare = (a, b) => (a || "").toString().toLowerCase().trim() === (b || "").toString().toLowerCase().trim();

    if (!compare(extractedData.studentName, dbData.studentName)) {
        differences.push(`Student name mismatch (Extracted: ${extractedData.studentName} vs DB: ${dbData.studentName})`);
        trustScore -= 30;
    }
    if (!compare(extractedData.course, dbData.course)) {
        differences.push("Course name mismatch");
        trustScore -= 30;
    }
    if (!compare(extractedData.organization, dbData.organization)) {
        differences.push("Organization mismatch");
        trustScore -= 20;
    }
    if (!compare(extractedData.certificateId, dbData.certificateId)) {
        differences.push("Certificate ID mismatch");
        trustScore -= 50;
    }

    const explanation = differences.length > 0 
        ? `Issues detected: ${differences.join("; ")}.` 
        : "Certificate details match our records perfectly. Authenticity verified via OCR & Database cross-referencing.";

    try {
        const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
        const payload = {
            contents: [{
                parts: [{
                    text: `Explain if this certificate is valid or suspicious based on these comparisons:
                    Extracted: ${JSON.stringify(extractedData)}
                    Database: ${JSON.stringify(dbData)}
                    Trust Score: ${trustScore}
                    Return JSON with: status (valid/suspicious), trustScore, explanation.`
                }]
            }]
        };

        const response = await axios.post(url, payload, { timeout: 2000 });
        const resultText = response.data.candidates[0].content.parts[0].text;
        return JSON.parse(resultText.replace(/```json|```/g, "").trim());
    } catch (error) {
        return {
            status: trustScore >= 80 ? "valid" : "suspicious",
            trustScore: Math.max(0, trustScore),
            explanation: explanation
        };
    }
};

module.exports = { parseCertificateText, explainFraud };
