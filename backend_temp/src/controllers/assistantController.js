import { analyzeProduct, chatWithAssistant } from '../services/bedrockService.js';

export const handleAnalyzeProduct = async (req, res) => {
  try {
    const { productContext } = req.body;
    
    if (!productContext) {
      return res.status(400).json({ message: 'Product context is required.' });
    }

    const result = await analyzeProduct(productContext);
    res.json(result);
  } catch (error) {
    console.error('Assistant Analysis Error:', error);
    res.status(503).json({ 
      message: error.message || 'AI Purchase Assistant is temporarily unavailable.', 
      details: error.stack 
    });
  }
};

export const handleChat = async (req, res) => {
  try {
    const { messages, productContext, analysisContext } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ message: 'Chat messages are required.' });
    }

    if (!productContext) {
      return res.status(400).json({ message: 'Product context is required.' });
    }

    const result = await chatWithAssistant(messages, productContext, analysisContext);
    res.json(result);
  } catch (error) {
    console.error('Assistant Chat Error:', error);
    res.status(503).json({ 
      message: error.message || 'AI Purchase Assistant is temporarily unavailable.', 
      details: error.stack 
    });
  }
};
