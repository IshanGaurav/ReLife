import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { creditRules } from '../engines/creditRules.js';

describe('creditRules', () => {
  // Feature: amazon-relife, Property 2: Green Credits arithmetic applies the exact action delta
  it('applies the exact action delta to the balance', () => {
    const actions = ['Resell', 'Donate', 'Recycle', 'BuyRefurbished', 'Return'];
    
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 100000 }),
        fc.constantFrom(...actions),
        (balance, action) => {
          const delta = creditRules.creditsFor(action);
          
          if (action === 'Resell') expect(delta).toBe(100);
          else if (action === 'Donate') expect(delta).toBe(150);
          else if (action === 'Recycle') expect(delta).toBe(75);
          else if (action === 'BuyRefurbished') expect(delta).toBe(50);
          else if (action === 'Return') expect(delta).toBe(0);
          
          const newBalance = creditRules.applyAction(balance, action);
          expect(newBalance).toBe(balance + delta);
          expect(newBalance).toBeGreaterThanOrEqual(balance);
        }
      )
    );
  });
});
