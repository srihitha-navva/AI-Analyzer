function validateUrl(inputUrl) {
    if (!inputUrl || typeof inputUrl !== 'string') return { isValid: false, error: 'Empty URL.' };
    
    // Add protocol if missing
    let urlToParse = inputUrl.trim();
    if (!/^https?:\/\//i.test(urlToParse)) {
        urlToParse = 'https://' + urlToParse;
    }

    try {
        const parsed = new URL(urlToParse);
        if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
            return { isValid: true, url: parsed.href };
        }
        return { isValid: false, error: 'Unsupported protocol. Please use http or https.' };
    } catch (e) {
        return { isValid: false, error: 'Invalid URL format.' };
    }
}

module.exports = { validateUrl };
