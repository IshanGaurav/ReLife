import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

let bedrockClient = null;

const getBedrockClient = () => {
  if (!bedrockClient) {
    bedrockClient = new BedrockRuntimeClient({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      }
    });
  }
  return bedrockClient;
};

export const analyzeSeoListing = async (title, description, features) => {
  try {
    const prompt = `You are an Amazon Product Listing SEO Expert.

Your goal is to improve discoverability, customer trust, and reduce returns.

Analyze:

Title:
${title || 'N/A'}

Description:
${description || 'N/A'}

Features:
${features || 'N/A'}

Return ONLY valid JSON with this exact structure (do not include markdown block formatting, just the raw JSON object):

{
  "seoScore": 0,
  "trustScore": 0,
  "returnRisk": "Low",
  "missingInformation": [],
  "optimizedTitle": "",
  "optimizedDescription": "",
  "suggestions": []
}`;

    const payload = {
      messages: [
        {
          role: "user",
          content: [
            {
              text: prompt
            }
          ]
        }
      ],
      inferenceConfig: {
        maxTokens: 2000,
        temperature: 0.2
      }
    };

    const command = new InvokeModelCommand({
      modelId: 'amazon.nova-lite-v1:0',
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify(payload),
    });

    console.log(`[Bedrock Service] Sending request to amazon.nova-lite-v1:0...`);
    const client = getBedrockClient();
    const response = await client.send(command);
    console.log("Bedrock Response:", response);
    console.log(`[Bedrock Service] Received response with HTTP status ${response.$metadata.httpStatusCode}`);
    const decodedBody = new TextDecoder().decode(response.body);
    const result = JSON.parse(decodedBody);
    
    let rawText = result.output?.message?.content?.[0]?.text || '';
    
    // Safely parse potentially markdown-wrapped JSON
    rawText = rawText.trim();
    if (rawText.startsWith('\`\`\`json')) {
      rawText = rawText.replace(/^\`\`\`json\s*/, '').replace(/\s*\`\`\`$/, '');
    } else if (rawText.startsWith('\`\`\`')) {
      rawText = rawText.replace(/^\`\`\`\s*/, '').replace(/\s*\`\`\`$/, '');
    }

    const parsedOutput = JSON.parse(rawText);
    console.log(`[Bedrock Service] Successfully parsed JSON output. Return Risk: ${parsedOutput.returnRisk}`);
    return parsedOutput;
  } catch (error) {
    console.error('Amazon Bedrock API Error:', error);
    throw new Error('Failed to analyze SEO listing with Bedrock: ' + error.message);
  }
};
export const analyzeProduct = async (productContext) => {
  try {
    const prompt = `You are an AI Purchase Assistant powered by Amazon Bedrock. 
Analyze the following product details and provide a brief, helpful summary for a shopper. 
Highlight 2-3 key benefits, 1 potential consideration (if any), and a welcoming introductory sentence.
Product Context: ${JSON.stringify(productContext)}
Format the response in JSON format like this:
{ "summary": "Welcome!...", "pros": ["...", "..."], "cons": ["..."] }
Ensure the JSON is strictly valid.`;

    const payload = {
      messages: [{ role: "user", content: [{ text: prompt }] }],
      inferenceConfig: { maxTokens: 800, temperature: 0.3 }
    };

    const command = new InvokeModelCommand({
      modelId: 'amazon.nova-lite-v1:0',
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify(payload),
    });

    console.log(`[Bedrock Service] Sending analyzeProduct request for ${productContext.name}...`);
    const client = getBedrockClient();
    const response = await client.send(command);
    console.log(`[Bedrock Service] Received analyzeProduct response with status ${response.$metadata.httpStatusCode}`);
    
    const decodedBody = new TextDecoder().decode(response.body);
    const result = JSON.parse(decodedBody);
    const textOutput = result.output?.message?.content?.[0]?.text || "{}";
    
    const jsonMatch = textOutput.match(/```json\n([\s\S]*?)\n```/) || textOutput.match(/\{[\s\S]*\}/);
    const jsonString = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : "{}";
    
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Failed to analyze product with Bedrock:', error);
    throw new Error(`Bedrock Product Analysis Failed: ${error.message}`);
  }
};

export const chatWithAssistant = async (messages, productContext, analysisContext) => {
  try {
    const systemPrompt = `You are a helpful AI Purchase Assistant powered by Amazon Bedrock. 
Your goal is to assist the user with questions about the following product:
${JSON.stringify(productContext)}

Previous Product Analysis Context:
${analysisContext ? JSON.stringify(analysisContext) : "No analysis available."}

Answer their questions based ONLY on the product context provided. 
If the information is not available, clearly state that you don't know based on the provided details. 
Be conversational, concise, and helpful.`;

    const formattedMessages = messages.map(msg => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: [{ text: msg.content }]
    }));

    const payload = {
      system: [{ text: systemPrompt }],
      messages: formattedMessages,
      inferenceConfig: { maxTokens: 1000, temperature: 0.5 }
    };

    const command = new InvokeModelCommand({
      modelId: 'amazon.nova-lite-v1:0',
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify(payload),
    });

    console.log(`[Bedrock Service] Sending chatWithAssistant request...`);
    const client = getBedrockClient();
    const response = await client.send(command);
    console.log(`[Bedrock Service] Received chatWithAssistant response with status ${response.$metadata.httpStatusCode}`);
    
    const decodedBody = new TextDecoder().decode(response.body);
    const result = JSON.parse(decodedBody);
    const textOutput = result.output?.message?.content?.[0]?.text || "I'm sorry, I couldn't generate a response.";
    
    return { response: textOutput };
  } catch (error) {
    console.error('Failed to chat with Bedrock:', error);
    throw new Error(`Bedrock Chat Failed: ${error.message}`);
  }
};
