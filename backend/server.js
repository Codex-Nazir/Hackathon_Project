const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load environment variables
dotenv.config();

console.log("MONGO_URI:", process.env.MONGO_URI);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(
  '/generated-certificates',
  express.static(path.join(__dirname, '../generated-certificates'))
);

// Ensure directories exist
const dirs = ['uploads', '../generated-certificates'];

dirs.forEach((dir) => {
  const dirPath = path.join(__dirname, dir);

  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// Routes
const certificateRoutes = require('./routes/certificateRoutes');

app.use('/api/certificates', certificateRoutes);

// Test Route
app.get('/', (req, res) => {
  res.send('CertifyAI API is running...');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});