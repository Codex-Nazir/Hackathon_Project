const Tesseract = require('tesseract.js');

const extractText = async (filePath) => {
    try {
        const { data: { text } } = await Tesseract.recognize(
            filePath,
            'eng',
            { logger: m => console.log(m) }
        );
        return text;
    } catch (error) {
        console.error("OCR Extraction Error:", error);
        throw error;
    }
};

module.exports = { extractText };
