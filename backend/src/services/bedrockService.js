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
