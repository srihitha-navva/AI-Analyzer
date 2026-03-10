const { scrapePage } = require('./scraper');
const { extractSemanticStructure } = require('./semanticExtractor');
const { isImportantPage } = require('../utils/linkFilter');

async function crawlWebsite(startUrl) {
    console.log(`Starting crawl for: ${startUrl}`);
    const results = {
        pages: [],
        screenshot: null,
        error: null,
        loginRequired: false
    };

    // Scrape homepage
    const homeResult = await scrapePage(startUrl);
    if (!homeResult.success) {
        results.error = homeResult.error;
        return results;
    }

    results.screenshot = homeResult.screenshot;
    const baseDomain = new URL(homeResult.url).origin;

    // Extract semantics for homepage
    const homeSemantics = extractSemanticStructure(homeResult.html);
    results.pages.push({
        url: homeResult.url,
        isHomepage: true,
        data: homeSemantics
    });

    if (homeSemantics.loginPage) {
        results.loginRequired = true;
    }

    // Filter important links to crawl deeper
    const importantLinks = homeResult.navLinks.filter(link => {
        try {
            if (new URL(link.href).origin !== baseDomain) return false;
            return isImportantPage(link.href, link.text);
        } catch(e) { return false; }
    });

    const uniqueUrls = [...new Set(importantLinks.map(l => l.href))];
    const pagesToCrawl = uniqueUrls.filter(u => u !== homeResult.url).slice(0, 4);

    console.log(`Found ${pagesToCrawl.length} important pages to crawl:`, pagesToCrawl);

    // Concurrently fetch the secondary pages for major speed boost
    const fetchPromises = pagesToCrawl.map(pageUrl => scrapePage(pageUrl));
    const secondaryResults = await Promise.all(fetchPromises);
    
    for (const pageResult of secondaryResults) {
        if (pageResult.success) {
            const semantics = extractSemanticStructure(pageResult.html);
            results.pages.push({
                url: pageResult.url,
                isHomepage: false,
                data: semantics
            });
            if (semantics.loginPage) {
                results.loginRequired = true;
            }
        }
    }

    const aggregatedData = aggregateData(results.pages);
    return {
        success: true,
        screenshot: results.screenshot,
        loginRequired: results.loginRequired,
        aggregatedData
    };
}

function aggregateData(pages) {
    const agg = {
        title: pages[0]?.data.title,
        description: pages[0]?.data.description,
        headings: [],
        sections: [],
        features: [],
        indicators: {
            pricing_detected: false,
            e_commerce_elements: false,
            article_structure: false,
            projects_detected: false,
            courses_detected: false
        }
    };

    pages.forEach(p => {
        if(p.data.headings) {
            agg.headings = agg.headings.concat(p.data.headings.h1, p.data.headings.h2, p.data.headings.h3);
        }
        if(p.data.sections) {
            agg.sections = agg.sections.concat(p.data.sections);
        }
        if(p.data.features) {
            agg.features = agg.features.concat(p.data.features);
        }
        
        const ind = p.data.indicators;
        if(ind) {
            agg.indicators.pricing_detected = agg.indicators.pricing_detected || ind.pricing_detected;
            agg.indicators.e_commerce_elements = agg.indicators.e_commerce_elements || ind.e_commerce_elements;
            agg.indicators.article_structure = agg.indicators.article_structure || ind.article_structure;
            agg.indicators.projects_detected = agg.indicators.projects_detected || ind.projects_detected;
            agg.indicators.courses_detected = agg.indicators.courses_detected || ind.courses_detected;
        }
    });
    
    agg.headings = [...new Set(agg.headings)].filter(Boolean).slice(0, 20);
    agg.sections = [...new Set(agg.sections)].filter(Boolean).slice(0, 15);
    
    const seenFeatures = new Set();
    agg.features = agg.features.filter(f => {
        if(seenFeatures.has(f.title)) return false;
        seenFeatures.add(f.title);
        return true;
    }).slice(0, 15);

    return agg;
}

module.exports = { crawlWebsite };
