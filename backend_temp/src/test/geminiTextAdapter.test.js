import { describe, it, expect, vi, beforeEach } from 'vitest';
import fc from 'fast-check';
import { geminiTextAdapter } from '../adapters/geminiTextAdapter.js';

const generateContentMock = vi.fn();

vi.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: vi.fn(() => ({
      getGenerativeModel: vi.fn(() => ({
        generateContent: (...args) => globalThis.__mockGenerateContentText(...args)
      }))
    }))
  };
});

describe('geminiTextAdapter property test', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    globalThis.__mockGenerateContentText = vi.fn();
  });

  // Feature: amazon-relife, Property test for Gemini Text retry logic
  it('retries on failure and eventually succeeds or exhausts retries', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 1, max: 5 }), // number of failures before success
        async (failsCount) => {
          let callCount = 0;
          globalThis.__mockGenerateContentText.mockImplementation(async () => {
            callCount++;
            if (callCount <= failsCount) {
              throw new Error('API Rate Limit Exceeded');
            }
            return {
              response: { text: () => '{"reviewSummary": "Good", "topComplaints": [], "improvementSuggestions": [], "dominantComplaint": "None"}' }
            };
          });

          if (failsCount >= 3) {
            // Retries = 3
            await expect(geminiTextAdapter.summarizeFeedback(['Bad battery'], 3))
              .rejects.toThrow(/Gemini text analysis failed/);
            expect(callCount).toBe(3);
          } else {
            // Will succeed
            const result = await geminiTextAdapter.summarizeFeedback(['Bad battery'], 3);
            expect(result.reviewSummary).toBe('Good');
            expect(callCount).toBe(failsCount + 1);
          }
        }
      ),
      { numRuns: 20 }
    );
  });
});
