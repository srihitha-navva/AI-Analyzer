const { GoogleGenAI } = require('@google/genai');

async function analyzeWithAI(structuredData, categories) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error("Gemini API Key is missing. Please configure it in the .env file.");
    }

    const ai = new GoogleGenAI({ apiKey: apiKey });

    const payload = {
        extracted_data: structuredData,
        detected_categories: categories
    };

    const prompt = `
You are an expert content summarizer and web analyst. Analyze the following scraped semantic structure of a website.
Determine what the website is about, extract key takeaways, generate study/actionable notes, and suggest further resources.

Website Details:
${JSON.stringify(payload)}

Return your analysis strictly as a JSON object matching this schema:
{
  "summary": "1-2 paragraphs summarizing the website's main content, purpose, and value.",
  "key_points": ["point 1", "point 2", "point 3", "point 4"],
  "notes": ["actionable advice 1", "study note 2", "important takeaway 3"],
  "resources": ["Suggested Related Topic 1", "Search Term 2", "External Resource Type 3"],
  "category": "Main category of the page (e.g. Encyclopedia, SaaS, Blog, Documentation)",
  "tech_stack": ["Detected Tech 1", "Detected Tech 2"] 
}

Note: If a tech stack is not obviously detectable, simply include standard web technologies like ["HTML", "CSS", "JavaScript"].

Provide ONLY valid parsing-safe JSON without any markdown formatting wrappers (no \`\`\`json etc.). Do not include trailing commas. Ensure it can be processed by JSON.parse().
`;

    try {
        console.log("[AI Live] Requesting Gemini analysis...");
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.2,
                responseMimeType: "application/json"
            }
        });

        const resultJson = response.text;
        return JSON.parse(resultJson);
    } catch (error) {
        console.error("Gemini Analysis Failed:", error.message);
        throw new Error("Failed to generate AI insights: " + error.message);
    }
}

module.exports = { analyzeWithAI };

