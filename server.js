require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Setup Middleware
app.use(cors());
app.use(express.json());

// Ensure the screenshots directory exists
const screenshotsDir = path.join(__dirname, 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
}

// Serve static compiled UI files
app.use(express.static(path.join(__dirname, 'frontend')));

// Serve the snapshots securely
app.use('/screenshots', express.static(screenshotsDir));

// Attach API Routes
const analyzeRouter = require('./routes/analyze');
app.use('/api/analyze', analyzeRouter);

app.listen(PORT, () => {
    console.log(`🚀 AI Website X-Ray Analyzer running on http://localhost:${PORT}`);
});
