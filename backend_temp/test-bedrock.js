import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import dotenv from 'dotenv';
dotenv.config();

const bedrockClient = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

async function testBedrock() {
  try {
    const prompt = "Say hello in JSON format like { \"message\": \"hello\" }";
    const payload = {
      messages: [{ role: "user", content: [{ text: prompt }] }],
      inferenceConfig: { maxTokens: 100, temperature: 0.2 }
    };
    const command = new InvokeModelCommand({
      modelId: 'amazon.nova-lite-v1:0',
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify(payload),
    });
    
    console.log("Sending request to Bedrock...");
    const response = await bedrockClient.send(command);
    const decodedBody = new TextDecoder().decode(response.body);
    const result = JSON.parse(decodedBody);
    console.log("Success! Response:");
    console.log(result.output?.message?.content?.[0]?.text);
  } catch (err) {
    console.error("Bedrock test failed:", err);
  }
}

testBedrock();
