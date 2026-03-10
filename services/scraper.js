const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function scrapePage(url) {
    let browser;
    try {
        browser = await puppeteer.launch({ 
            headless: 'new', // Suppress deprecation warning
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
        });
        const page = await browser.newPage();
        
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36');
        
        // Timeout protection logic
        await page.goto(url, { waitUntil: 'load', timeout: 30000 });
        
        const screenshotsDir = path.join(__dirname, '..', 'screenshots');
        if (!fs.existsSync(screenshotsDir)) {
            fs.mkdirSync(screenshotsDir, { recursive: true });
        }
        
        const screenshotFileName = `screenshot-${Date.now()}-${Math.floor(Math.random() * 10000)}.png`;
        const screenshotPath = path.join(screenshotsDir, screenshotFileName);
        
        await page.screenshot({ path: screenshotPath, fullPage: false });

        const html = await page.content();
        
        const navLinks = await page.evaluate(() => {
            const links = Array.from(document.querySelectorAll('a'));
            return links.map(a => ({
                href: a.href,
                text: a.innerText.trim()
            })).filter(a => a.href && a.href.startsWith('http') && a.text.length > 0);
        });

        return { 
            success: true, 
            html, 
            screenshot: `/screenshots/${screenshotFileName}`,
            navLinks,
            url: page.url() // Capturing final destination URL if there was a redirect
        };
    } catch (error) {
        console.error('Puppeteer Scraping error:', error.message);
        return { success: false, error: 'Failed to scrape the website: ' + error.message };
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

module.exports = { scrapePage };
