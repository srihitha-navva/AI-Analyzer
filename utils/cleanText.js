function cleanText(text) {
    if (!text || typeof text !== 'string') return '';
    
    // Replace multiple spaces and newlines with a single space
    return text.replace(/\s+/g, ' ').trim();
}

module.exports = { cleanText };
