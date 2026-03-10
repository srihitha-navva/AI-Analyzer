const express = require('express');
const router = express.Router();
const { validateUrl } = require('../utils/validateUrl');
const { crawlWebsite } = require('../services/pageCrawler');
const { detectCategory } = require('../services/categoryDetector');
const { analyzeWithAI } = require('../services/aiAnalyzer');

router.post('/', async (req, res) => {
    const { url } = req.body;
    
    // 1. Validate Input
    const validation = validateUrl(url);
    if (!validation.isValid) {
        return res.status(400).json({ error: validation.error });
    }

    try {
        // 2. Crawl and Extract
        console.log(`[API] Crawling: ${validation.url}`);
        const crawlResult = await crawlWebsite(validation.url);
        
        if (!crawlResult.success) {
            return res.status(500).json({ error: crawlResult.error });
        }

        // 3. Detect Category
        console.log(`[API] Detecting category...`);
        const { indicators, features } = crawlResult.aggregatedData || {};
        const categories = detectCategory(indicators, features);

        // 4. Generate AI Insights
        console.log(`[API] Requesting AI insights generation...`);
        const aiInsights = await analyzeWithAI(crawlResult.aggregatedData, categories);

        // 5. Build Final Response
        const finalResponse = {
            loginRequired: crawlResult.loginRequired,
            warning: crawlResult.loginRequired ? "This page requires login. Only public pages will be analyzed." : undefined,
            ...aiInsights,
            screenshot: crawlResult.screenshot
        };

        res.json(finalResponse);
    } catch (error) {
        console.error('[API] Error during analysis:', error);
        res.status(500).json({ error: 'Internal Server Error: ' + error.message });
    }
});

module.exports = router;
