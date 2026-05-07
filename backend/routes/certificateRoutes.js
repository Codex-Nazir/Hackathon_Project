const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const certificateController = require('../controllers/certificateController');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ 
    storage,
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        if (ext === '.pdf' || ext === '.png' || ext === '.jpg' || ext === '.jpeg') {
            cb(null, true);
        } else {
            cb(new Error('Only images and PDFs are allowed'));
        }
    }
});

router.post('/generate', certificateController.generateCertificate);
router.post('/validate', upload.single('certificate'), certificateController.validateCertificate);
router.get('/:id', certificateController.getCertificate);

module.exports = router;
