import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { badgeRules } from '../engines/badgeRules.js';

describe('badgeRules', () => {
  // Feature: amazon-relife, Property 3: Badge tiering returns the correct highest tier for any balance
  it('returns the correct highest tier for any balance', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 5000 }), (balance) => {
        const badge = badgeRules.badgeFor(balance);
        
        if (balance >= 1000) expect(badge).toBe('Gold Circular Citizen');
        else if (balance >= 500) expect(badge).toBe('Silver Circular Citizen');
        else if (balance >= 100) expect(badge).toBe('Bronze Circular Citizen');
        else expect(badge).toBeNull();
      })
    );
  });

  // Feature: amazon-relife, Property 4: Badge awards are monotonic, idempotent, and never revoked
  it('awards newly crossed thresholds exactly once', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 5000 }),
        fc.integer({ min: 0, max: 5000 }),
        (p, n) => {
          const prev = Math.min(p, n);
          const next = Math.max(p, n);
          
          const newlyEarned = badgeRules.newlyEarned(prev, next);
          
          if (prev < 100 && next >= 100) expect(newlyEarned).toContain('Bronze Circular Citizen');
          else expect(newlyEarned).not.toContain('Bronze Circular Citizen');
          
          if (prev < 500 && next >= 500) expect(newlyEarned).toContain('Silver Circular Citizen');
          else expect(newlyEarned).not.toContain('Silver Circular Citizen');
          
          if (prev < 1000 && next >= 1000) expect(newlyEarned).toContain('Gold Circular Citizen');
          else expect(newlyEarned).not.toContain('Gold Circular Citizen');
        }
      )
    );
  });
});
