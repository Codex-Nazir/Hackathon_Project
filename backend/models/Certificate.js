const mongoose = require('mongoose');

const CertificateSchema = new mongoose.Schema({
    certificateId: {
        type: String,
        required: true,
        unique: true
    },
    studentName: {
        type: String,
        required: true
    },
    course: {
        type: String,
        required: true
    },
    organization: {
        type: String,
        required: true
    },
    issueDate: {
        type: Date,
        default: Date.now
    },
    hash: {
        type: String,
        required: true
    },
    qrCode: {
        type: String, // Base64 or Path
    },
    pdfPath: {
        type: String,
    }
}, { timestamps: true });

module.exports = mongoose.model('Certificate', CertificateSchema);
