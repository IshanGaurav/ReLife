import multer from 'multer';
import { ValidationError } from '../errors/index.js';

// Currently using local memory storage for multer;
// For full S3 integration, this would use multer-s3 or handle buffer uploads to S3 directly.
// This implements the uploadMiddleware signature required.

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new ValidationError('Not an image or video! Please upload only media files.'), false);
  }
};

export const uploadMedia = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});
