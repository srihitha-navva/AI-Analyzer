# AI Website X-Ray Analyzer

An intelligent, full-stack application that crawls any website, analyzes its semantic structure, detects the business model, and generates an AI-powered insights report—all within a stunning, glassmorphism-styled dashboard.

## Features
- **Deep Semantic Scraping**: Uses Puppeteer to pull headings, features, metadata, and extract linked sub-pages securely.
- **Smart Category Detection**: Recognizes SaaS, E-commerce, Blogs, Portfolios, and Educational platforms based on DOM footprints organically.
- **OpenAI Intelligence**: Converts structured DOM metrics into executive summaries, competitor analysis, startup scores, and likely tech stacks using `gpt-4o-mini`.
- **Premium UI**: Ultra-modern, responsive CSS dashboard incorporating glassmorphism, floating orbs, and dynamic animations.

## Setup Instructions

1. **Install Dependencies**:
```bash
npm install
```

2. **Configure Environment Variables**:
Open the `.env` file and insert your OpenAI API Key:
```text
OPENAI_API_KEY="your-sk-api-key-here"
```

3. **Start the Server**:
```bash
node server.js
```

4. **Open the App**:
Navigate to `http://localhost:3000` in your web browser.

## Tech Stack
- **Backend**: Node.js, Express.js, Puppeteer
- **Frontend**: Vanilla HTML/JavaScript, Native CSS Variables & Gradients
- **AI Integration**: OpenAI SDK (gpt-4o-mini)
