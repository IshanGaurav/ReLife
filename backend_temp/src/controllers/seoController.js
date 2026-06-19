import { analyzeSeoListing } from '../services/bedrockService.js';

export const analyzeSellerSEO = async (req, res) => {
  try {
    console.log("SEO Request Received");
    console.log(req.body);
    
    const { title, description, features } = req.body;
    
    console.log(`[SEO Controller] Request received for title: "${title?.substring(0, 30)}..."`);

    if (!title && !description) {
      return res.status(400).json({ message: 'Title or description must be provided for analysis.' });
    }

    console.log("AWS_REGION:", process.env.AWS_REGION);
    console.log("Has Key:", !!process.env.AWS_ACCESS_KEY_ID);
    console.log("Has Secret:", !!process.env.AWS_SECRET_ACCESS_KEY);

    // Set a timeout manually or rely on SDK, but typically we just await
    const result = await analyzeSeoListing(title, description, features);

    res.json(result);
  } catch (error) {
    console.error("BEDROCK ERROR:", error);
    res.status(503).json({ message: error.message || 'SEO Analysis service is temporarily unavailable.', details: error.stack });
  }
};
