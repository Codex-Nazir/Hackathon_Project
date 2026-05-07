const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/generated-certificates', express.static(path.join(__dirname, '../generated-certificates')));

const dirs = ['uploads', '../generated-certificates'];
dirs.forEach(dir => {
    const dirPath = path.join(__dirname, dir);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
});

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

const certificateRoutes = require('./routes/certificateRoutes');
app.use('/api/certificates', certificateRoutes);

app.get('/', (req, res) => {
    res.send('CertifyAI API is running...');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
