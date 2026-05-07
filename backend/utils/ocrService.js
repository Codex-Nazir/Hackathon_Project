const Tesseract = require('tesseract.js');
const pdf = require('pdf-parse');
const fs = require('fs');
const path = require('path');

const extractText = async (filePath) => {
    try {
        const ext = path.extname(filePath).toLowerCase();
        
        if (ext === '.pdf') {
            console.log("Starting PDF extraction for:", filePath);
            const dataBuffer = fs.readFileSync(filePath);
            const data = await pdf(dataBuffer);
            console.log("PDF extraction successful. Text length:", data.text.length);
            return data.text;
        } else {
            const { data: { text } } = await Tesseract.recognize(
                filePath,
                'eng'
            );
            return text;
        }
    } catch (error) {
        console.error("Extraction Error:", error);
        throw error;
    }
};

module.exports = { extractText };
