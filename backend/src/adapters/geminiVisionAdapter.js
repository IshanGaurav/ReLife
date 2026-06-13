import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../config/env.js';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const geminiVisionAdapter = {
  async analyze(mediaUrls, retries = 3) {
    const genAI = new GoogleGenerativeAI(env.geminiApiKey || 'dummy-key');
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    
    const prompt = `Analyze these product images. Estimate the condition score from 0-100. 
      Return only a JSON object like: { "score": 85, "reasoning": "...", "damage": ["scratch on back"] }`;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        // Feed URLs as text inputs to Gemini prompt for analysis representation
        const inputs = [prompt, ...mediaUrls.map(url => ({ text: `Image URL: ${url}` }))];
        const result = await model.generateContent(inputs);
        const responseText = result.response.text();
        
        // Naive JSON extraction assuming Gemini returns block-fenced JSON or raw JSON
        const match = responseText.match(/\{[\s\S]*\}/);
        if (!match) throw new Error('Invalid JSON format returned from Gemini');
        
        return JSON.parse(match[0]);
      } catch (error) {
        if (attempt === retries) {
          throw new Error(`Gemini vision analysis failed after ${retries} attempts: ${error.message}`);
        }
        // Exponential backoff
        await sleep(10 * Math.pow(2, attempt)); 
      }
    }
  }
};
