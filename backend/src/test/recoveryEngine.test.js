import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { recoveryEngine } from '../engines/recoveryEngine.js';

describe('recoveryEngine', () => {
  // Feature: amazon-relife, Property 5: Recovery routing follows the eligibility-then-ratio decision tree
  it('routes correctly based on eligibility and recovery ratio', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 100 }),
        fc.integer({ min: 1, max: 10000 }),
        fc.integer({ min: 1, max: 1000 }),
        (score, value, cost) => {
          const result = recoveryEngine.route(score, value, cost, 2.0);
          
          if (score < 90) {
            expect(result.eligible).toBe(false);
            expect(result.decision).toBe('Return To Seller');
            expect(result.ratio).toBeNull();
          } else {
            expect(result.eligible).toBe(true);
            const ratio = value / cost;
            expect(result.ratio).toBe(ratio);
            
            if (ratio >= 2.0) {
              expect(result.decision).toBe('Return To Seller');
            } else {
              expect(result.decision).toBe('Nearby Recovery Hub');
            }
          }
        }
      )
    );
  });

  it('throws on non-positive logistics cost', () => {
    expect(() => recoveryEngine.route(95, 100, 0)).toThrow('Logistics cost must be positive');
    expect(() => recoveryEngine.route(95, 100, -5)).toThrow('Logistics cost must be positive');
  });
});
