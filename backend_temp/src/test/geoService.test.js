import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { geoService } from '../services/geoService.js';

describe('geoService', () => {
  it('computes distance symmetrically and non-negatively', () => {
    fc.assert(
      fc.property(
        fc.record({ lat: fc.float({ min: -90, max: 90, noNaN: true }), lng: fc.float({ min: -180, max: 180, noNaN: true }) }),
        fc.record({ lat: fc.float({ min: -90, max: 90, noNaN: true }), lng: fc.float({ min: -180, max: 180, noNaN: true }) }),
        (a, b) => {
          const d1 = geoService.haversine(a, b);
          const d2 = geoService.haversine(b, a);
          
          expect(d1).toBeGreaterThanOrEqual(0);
          // Allow small floating point drift
          expect(Math.abs(d1 - d2)).toBeLessThan(0.0001);
        }
      )
    );
  });

  it('returns 0 for identical points', () => {
    fc.assert(
      fc.property(
        fc.record({ lat: fc.float({ min: -90, max: 90, noNaN: true }), lng: fc.float({ min: -180, max: 180, noNaN: true }) }),
        (a) => {
          expect(geoService.haversine(a, a)).toBe(0);
        }
      )
    );
  });

  it('computes a known distance correctly', () => {
    // NYC to LA approx 3940 km
    const nyc = { lat: 40.7128, lng: -74.0060 };
    const la = { lat: 34.0522, lng: -118.2437 };
    const dist = geoService.haversine(nyc, la);
    
    // Check within 10km margin of error
    expect(dist).toBeGreaterThan(3930);
    expect(dist).toBeLessThan(3950);
  });
});
