const Certificate = require('../models/Certificate');
const { generateCertificatePDF } = require('../utils/certificateGen');
const { extractText } = require('../utils/ocrService');
const { parseCertificateText, explainFraud } = require('../utils/aiService');
const fs = require('fs');

exports.generateCertificate = async (req, res) => {
    try {
        const { studentName, course, organization, certificateId, issueDate } = req.body;

        // Check if certificate already exists
        const existing = await Certificate.findOne({ certificateId });
        if (existing) {
            return res.status(400).json({ error: "Certificate ID already exists." });
        }

        const { filePath, hash, qrCodeImage, fileName } = await generateCertificatePDF({
            studentName, course, organization, certificateId, issueDate
        });

        const newCertificate = new Certificate({
            certificateId,
            studentName,
            course,
            organization,
            issueDate,
            hash,
            qrCode: qrCodeImage,
            pdfPath: fileName
        });

        await newCertificate.save();

        res.status(201).json({
            message: "Certificate generated successfully",
            certificate: newCertificate,
            downloadUrl: `/generated-certificates/${fileName}`
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to generate certificate." });
    }
};

exports.validateCertificate = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded." });
        }

        const filePath = req.file.path;

        // 1. Extract Text via OCR
        const text = await extractText(filePath);

        // 2. Parse Text via AI
        const extractedData = await parseCertificateText(text);
        if (!extractedData || !extractedData.certificateId) {
            return res.status(400).json({ 
                error: "Could not extract valid certificate information. File might be invalid or too blurry.",
                extractedData 
            });
        }

        // 3. Find in Database
        const dbData = await Certificate.findOne({ certificateId: extractedData.certificateId });

        if (!dbData) {
            return res.status(404).json({
                status: "suspicious",
                trustScore: 10,
                explanation: "Certificate ID not found in our database. Possible forgery.",
                extractedData
            });
        }

        // 4. Compare and Explain via AI
        const analysis = await explainFraud(extractedData, dbData);

        res.json({
            status: analysis.status,
            trustScore: analysis.trustScore,
            explanation: analysis.explanation,
            extractedData,
            originalRecord: dbData
        });

        // Cleanup: Optionally delete uploaded file
        // fs.unlinkSync(filePath);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Validation failed." });
    }
};

exports.getCertificate = async (req, res) => {
    try {
        const cert = await Certificate.findOne({ certificateId: req.params.id });
        if (!cert) return res.status(404).json({ error: "Not found" });
        res.json(cert);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};
