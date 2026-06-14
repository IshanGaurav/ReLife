import express from 'express';
import multer from 'multer';
import { StorageService } from '../services/storageService.js';

const router = express.Router();

// Use memory storage to process files before sending them to the StorageService
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit per file
});

// Upload multiple files
router.post('/upload', upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const uploadPromises = req.files.map(file => StorageService.uploadFile(file));
    const results = await Promise.all(uploadPromises);

    // Results is an array of { id, filename, url }
    res.status(200).json({
      success: true,
      message: 'Images uploaded successfully',
      images: results
    });
  } catch (error) {
    console.error('UPLOAD ERROR:', error);
    res.status(500).json({ message: 'Failed to upload images', error: error.message });
  }
});

// Serve images from GridFS
router.get('/images/:id', async (req, res) => {
  try {
    const fileInfo = await StorageService.getFileInfo(req.params.id);
    if (!fileInfo) {
      return res.status(404).send('Image not found');
    }

    res.set('Content-Type', fileInfo.contentType);
    res.set('Cache-Control', 'public, max-age=31557600'); // Cache for 1 year

    const readStream = StorageService.getFileStream(req.params.id);
    readStream.on('error', () => res.status(500).send('Error reading image'));
    readStream.pipe(res);
  } catch (error) {
    res.status(404).send('Image not found');
  }
});

export default router;
