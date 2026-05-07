# CertifyAI - Setup Guide

## Prerequisites
- Node.js installed
- MongoDB installed and running
- Gemini API Key (Get one from [Google AI Studio](https://aistudio.google.com/))

## Installation

### 1. Backend
```bash
cd backend
npm install
```
Create a `.env` file in `backend/` with:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/certifyai
GEMINI_API_KEY=your_actual_key_here
```

### 2. Frontend
```bash
cd frontend
npm install
```

## Running the Application

### Start Backend
```bash
cd backend
node server.js
```

### Start Frontend
```bash
cd frontend
npm run dev
```

## How to Test
1. Go to `http://localhost:5173`
2. Navigate to **Generate Certificate**.
3. Fill in the details and click **Create**.
4. Download the PDF.
5. Navigate to **Validate Certificate**.
6. Upload the downloaded PDF.
7. Observe the AI analysis and Trust Score.
