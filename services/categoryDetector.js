function detectCategory(indicators = {}, features = []) {
    const { 
        pricing_detected, 
        e_commerce_elements, 
        article_structure, 
        projects_detected, 
        courses_detected 
    } = indicators;
    
    const categories = [];

    // Applying logical rules mapping metrics onto categories
    if (pricing_detected && features && features.length > 0) {
        categories.push("SaaS");
    }
    
    if (e_commerce_elements) {
        categories.push("E-commerce");
    }
    
    if (article_structure) {
        categories.push("Blog");
    }
    
    if (projects_detected) {
        categories.push("Portfolio");
    }
    
    if (courses_detected) {
        categories.push("Educational platform");
    }

    // Default fallback
    if (categories.length === 0) {
        categories.push("Corporate company websites"); 
    }

    return categories.slice(0, 2);
}

module.exports = { detectCategory };
