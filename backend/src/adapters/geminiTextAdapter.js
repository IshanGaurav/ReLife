import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../config/env.js';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const geminiTextAdapter = {
  async summarizeFeedback(feedbackItems, retries = 3) {
    const genAI = new GoogleGenerativeAI(env.geminiApiKey || 'dummy-key');
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `Analyze the following customer feedback items for a product.
    Extract the top complaints and improvement suggestions. 
    Return strictly JSON in the following format:
    { "reviewSummary": "...", "topComplaints": ["..."], "improvementSuggestions": ["..."], "dominantComplaint": "..." }
    
    Feedback:
    ${JSON.stringify(feedbackItems)}
    `;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        
        const match = responseText.match(/\{[\s\S]*\}/);
        if (!match) throw new Error('Invalid JSON format returned from Gemini');
        
        return JSON.parse(match[0]);
      } catch (error) {
        if (attempt === retries) {
          throw new Error(`Gemini text analysis failed after ${retries} attempts: ${error.message}`);
        }
        await sleep(10 * Math.pow(2, attempt)); 
      }
    }
  }
};
