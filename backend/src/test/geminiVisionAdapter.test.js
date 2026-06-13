import { describe, it, expect, vi, beforeEach } from 'vitest';
import fc from 'fast-check';
import { geminiVisionAdapter } from '../adapters/geminiVisionAdapter.js';

vi.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: vi.fn(() => ({
      getGenerativeModel: vi.fn(() => ({
        generateContent: (...args) => globalThis.__mockGenerateContent(...args)
      }))
    }))
  };
});

describe('geminiVisionAdapter property test', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    globalThis.__mockGenerateContent = vi.fn();
  });

  // Feature: amazon-relife, Property test for Gemini retry logic
  it('retries on failure and eventually succeeds or exhausts retries', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 1, max: 5 }), // number of failures before success
        async (failsCount) => {
          let callCount = 0;
          globalThis.__mockGenerateContent.mockImplementation(async () => {
            callCount++;
            if (callCount <= failsCount) {
              throw new Error('API Rate Limit Exceeded');
            }
            return {
              response: { text: () => '{"score": 90, "reasoning": "Looks good", "damage": []}' }
            };
          });

          if (failsCount >= 3) {
            // Retries = 3
            await expect(geminiVisionAdapter.analyze(['http://example.com/img.jpg'], 3))
              .rejects.toThrow(/Gemini vision analysis failed/);
            expect(callCount).toBe(3);
          } else {
            // Will succeed
            const result = await geminiVisionAdapter.analyze(['http://example.com/img.jpg'], 3);
            expect(result.score).toBe(90);
            expect(callCount).toBe(failsCount + 1);
          }
        }
      ),
      { numRuns: 20 }
    );
  });
});
