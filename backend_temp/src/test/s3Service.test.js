import { describe, it, expect, vi } from 'vitest';
import { s3Service } from '../adapters/s3Service.js';

vi.mock('@aws-sdk/client-s3', () => {
  return {
    S3Client: vi.fn(() => ({
      send: vi.fn().mockResolvedValue({ $metadata: { httpStatusCode: 200 } })
    })),
    PutObjectCommand: vi.fn()
  };
});

describe('s3Service', () => {
  it('generates a URL based on the key', () => {
    const url = s3Service.getUrl('test-key.jpg');
    expect(url).toMatch(/test-key\.jpg$/);
    expect(url).toMatch(/^https:\/\//);
  });

  it('uploads a buffer and returns a key', async () => {
    const buffer = Buffer.from('test image data');
    const meta = { originalname: 'test.jpg', mimetype: 'image/jpeg' };
    
    const key = await s3Service.upload(buffer, meta);
    expect(key).toMatch(/test\.jpg$/);
    expect(key).toContain('secondlife/');
  });
});
