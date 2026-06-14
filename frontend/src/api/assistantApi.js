import api from './client';

export const analyzeProductWithAssistant = async (productContext) => {
  try {
    const response = await api.post('/v2/assistant/analyze', { productContext });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const chatWithAssistant = async (messages, productContext, analysisContext) => {
  try {
    const response = await api.post('/v2/assistant/chat', { messages, productContext, analysisContext });
    return response.data;
  } catch (error) {
    throw error;
  }
};
