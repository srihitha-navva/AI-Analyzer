const cheerio = require('cheerio');
const { cleanText } = require('../utils/cleanText');

function extractSemanticStructure(html) {
    const $ = cheerio.load(html);
    
    const bodyText = cleanText($('body').text()).toLowerCase();
    
    // Check for login page cues using heuristics
    const loginCues = ['password', 'sign in', 'log in', 'continue with google'];
    const isLoginPage = loginCues.some(cue => bodyText.includes(cue)) && $('input[type="password"]').length > 0;
    
    // Core structural nodes
    const title = cleanText($('title').text());
    const description = $('meta[name="description"]').attr('content') || '';
    const keywords = $('meta[name="keywords"]').attr('content') || '';

    const headings = { h1: [], h2: [], h3: [] };
    $('h1').each((_, el) => { const text = cleanText($(el).text()); if(text) headings.h1.push(text); });
    $('h2').each((_, el) => { const text = cleanText($(el).text()); if(text) headings.h2.push(text); });
    $('h3').each((_, el) => { const text = cleanText($(el).text()); if(text) headings.h3.push(text); });

    // Truncate sections to prevent large context blowing API token limit
    const sections = [];
    $('section, article, main').each((_, el) => {
        const text = cleanText($(el).text());
        if (text && text.length > 50) {
            sections.push(text.substring(0, 500));
        }
    });

    // Detect feature blocks by checking consecutive header + text layouts conventionally used
    const featureBlocks = [];
    $(':header + p, :header + div > p').each((_, el) => {
        const headerText = cleanText($(el).prev().text());
        const descText = cleanText($(el).text());
        if (headerText && descText) {
            featureBlocks.push({ title: headerText, description: descText });
        }
    });

    const pricingKeywords = ['pricing', 'plans', 'per month', 'subscription', 'free trial'];
    const ecommerceKeywords = ['add to cart', 'buy now', 'checkout'];
    const blogKeywords = ['published', 'author', 'read more', 'article'];
    const portfolioKeywords = ['projects', 'portfolio', 'resume', 'skills'];
    const educationKeywords = ['courses', 'enroll', 'instructor', 'certificate'];
    
    const indications = {
        pricing_detected: pricingKeywords.some(kw => bodyText.includes(kw)),
        e_commerce_elements: ecommerceKeywords.some(kw => bodyText.includes(kw)),
        article_structure: $('article').length > 0 || blogKeywords.some(kw => bodyText.includes(kw)),
        projects_detected: portfolioKeywords.some(kw => bodyText.includes(kw)),
        courses_detected: educationKeywords.some(kw => bodyText.includes(kw))
    };

    return {
        loginPage: isLoginPage,
        title,
        description,
        keywords,
        headings,
        sections,
        features: featureBlocks,
        indicators: indications
    };
}

module.exports = { extractSemanticStructure };
