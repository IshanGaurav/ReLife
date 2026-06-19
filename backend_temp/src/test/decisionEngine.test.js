import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { decisionEngine } from '../engines/decisionEngine.js';

describe('decisionEngine', () => {
  // Feature: amazon-relife, Property 1: Decision engine assigns the correct disposition for every condition score
  it('assigns correct disposition based on condition score', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 100 }), (score) => {
        const disposition = decisionEngine.decide(score);
        
        if (score > 85) {
          expect(disposition).toBe('Resell');
        } else if (score >= 65 && score <= 85) {
          expect(disposition).toBe('Refurbish');
        } else if (score >= 35 && score < 65) {
          expect(disposition).toBe('Donate');
        } else {
          expect(disposition).toBe('Recycle');
        }
      })
    );
  });
});
