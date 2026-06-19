import mongoose from 'mongoose';
import { Readable } from 'stream';

let gfsBucket;

mongoose.connection.once('open', () => {
  gfsBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: 'uploads'
  });
  console.log('GridFS initialized');
});

/**
 * Storage Service Abstraction
 * This can easily be swapped with an S3 implementation in the future.
 */
export const StorageService = {
  uploadFile: async (file) => {
    return new Promise((resolve, reject) => {
      if (!gfsBucket) {
        return reject(new Error('GridFS is not initialized yet.'));
      }
      
      // Ensure unique filename
      const filename = `${Date.now()}-${Math.round(Math.random() * 1E9)}-${file.originalname.replace(/[^a-zA-Z0-9.]/g, '')}`;
      
      const uploadStream = gfsBucket.openUploadStream(filename, {
        contentType: file.mimetype
      });
      
      const readableStream = new Readable();
      readableStream.push(file.buffer);
      readableStream.push(null);
      
      readableStream.pipe(uploadStream)
        .on('error', (err) => reject(err))
        .on('finish', () => resolve({
          id: uploadStream.id.toString(),
          filename: filename,
          url: `http://localhost:5000/api/v2/images/${uploadStream.id.toString()}` // Frontend uses this URL
        }));
    });
  },
  
  getFileStream: (id) => {
    if (!gfsBucket) {
      throw new Error('GridFS is not initialized yet.');
    }
    const objectId = new mongoose.Types.ObjectId(id);
    return gfsBucket.openDownloadStream(objectId);
  },

  getFileInfo: async (id) => {
    if (!gfsBucket) {
      throw new Error('GridFS is not initialized yet.');
    }
    const objectId = new mongoose.Types.ObjectId(id);
    const files = await gfsBucket.find({ _id: objectId }).toArray();
    if (!files || files.length === 0) return null;
    return files[0];
  }
};
