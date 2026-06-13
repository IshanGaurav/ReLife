import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import fc from 'fast-check';
import { authService } from '../services/authService.js';
import { env } from '../config/env.js';

describe('authService token round trip', () => {
  beforeAll(() => {
    // Mock env secret if not set
    if (!env.jwtSecret) {
      env.jwtSecret = 'test_secret_key';
    }
  });

  // Feature: amazon-relife, Property test for the auth token round trip
  it('encodes and decodes a payload losslessly', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }),
        fc.constantFrom('User', 'Seller', 'Admin', 'RecoveryHub'),
        (id, role) => {
          const user = { _id: id, role };
          
          const token = authService.generateToken(user);
          const decoded = authService.verifyToken(token);
          
          expect(decoded.id).toBe(id);
          expect(decoded.role).toBe(role);
          // JWT adds iat and exp
          expect(decoded).toHaveProperty('iat');
          expect(decoded).toHaveProperty('exp');
        }
      )
    );
  });
  
  it('throws AuthenticationError on invalid token', () => {
    expect(() => authService.verifyToken('invalid.token.here')).toThrow('Invalid or expired token');
  });
});
