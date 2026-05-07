const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');
const crypto = require('crypto');

const generateCertificatePDF = async (data) => {
    const { studentName, course, organization, certificateId, issueDate } = data;
    const fileName = `cert_${certificateId}.pdf`;
    const filePath = path.join(__dirname, '../../generated-certificates', fileName);
    
    // Create Hash
    const hash = crypto.createHash('sha256').update(`${certificateId}-${studentName}-${course}`).digest('hex');
    
    // Create QR Code
    const qrCodeData = `https://certifyai.com/verify/${certificateId}`;
    const qrCodeImage = await QRCode.toDataURL(qrCodeData);

    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({
            size: 'A4',
            layout: 'landscape',
            margin: 0
        });

        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        // Background Color
        doc.rect(0, 0, doc.page.width, doc.page.height).fill('#0f172a');

        // Border
        doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).lineWidth(5).stroke('#3b82f6');

        // Title
        doc.fillColor('#ffffff').fontSize(40).text('CERTIFICATE OF COMPLETION', 0, 100, { align: 'center' });
        
        doc.fontSize(20).text('This is to certify that', 0, 180, { align: 'center' });
        
        // Name
        doc.fillColor('#60a5fa').fontSize(45).text(studentName.toUpperCase(), 0, 220, { align: 'center' });
        
        doc.fillColor('#ffffff').fontSize(20).text('has successfully completed the course', 0, 300, { align: 'center' });
        
        // Course
        doc.fillColor('#3b82f6').fontSize(30).text(course, 0, 340, { align: 'center' });
        
        doc.fillColor('#ffffff').fontSize(18).text(`at ${organization}`, 0, 390, { align: 'center' });
        
        // Date and ID
        doc.fontSize(14).text(`Issue Date: ${new Date(issueDate).toLocaleDateString()}`, 100, 480);
        doc.text(`Certificate ID: ${certificateId}`, 100, 500);

        // QR Code
        doc.image(qrCodeImage, doc.page.width - 200, 430, { width: 100 });

        doc.end();

        stream.on('finish', () => {
            resolve({ filePath, hash, qrCodeImage, fileName });
        });

        stream.on('error', reject);
    });
};

module.exports = { generateCertificatePDF };
