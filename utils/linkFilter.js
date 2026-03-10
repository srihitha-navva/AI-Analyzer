function isImportantPage(url, linkText) {
    if (!url) return false;
    
    const text = (linkText || '').toLowerCase();
    const href = url.toLowerCase();
    
    // Ignore non-html files and anchor links
    if (href.startsWith('mailto:') || href.startsWith('tel:') || href.includes('#')) {
        return false;
    }

    // Ignore keywords suggesting login/auth/legal
    const ignoreKeywords = ['login', 'sign in', 'signin', 'sign-in', 'signup', 'sign up', 'sign-up', 'account', 'dashboard', 'privacy', 'terms', 'register', 'cart', 'checkout'];
    if (ignoreKeywords.some(keyword => text.includes(keyword) || href.includes(keyword))) {
        return false;
    }

    // Important keywords based on specifications
    const importantKeywords = ['pricing', 'features', 'product', 'about', 'solutions', 'docs', 'blog', 'developers'];
    
    // Match if the keyword is a distinct word in the path or text
    if (importantKeywords.some(keyword => text.includes(keyword) || href.includes(keyword))) {
        return true;
    }

    return false;
}

module.exports = { isImportantPage };
