import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { env } from '../config/env.js';

const s3Client = new S3Client({
  region: env.awsRegion || 'us-east-1',
  // Normally configured via AWS_ACCESS_KEY_ID & AWS_SECRET_ACCESS_KEY in env
});

export const s3Service = {
  async upload(buffer, meta) {
    const key = `secondlife/${Date.now()}-${meta.originalname}`;
    
    const command = new PutObjectCommand({
      Bucket: env.awsBucketName || 'amazon-relife-assets',
      Key: key,
      Body: buffer,
      ContentType: meta.mimetype,
    });

    await s3Client.send(command);
    return key;
  },

  getUrl(key) {
    const bucket = env.awsBucketName || 'amazon-relife-assets';
    const region = env.awsRegion || 'us-east-1';
    return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
  }
};
