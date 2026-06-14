import mongoose from 'mongoose';
import { StorageService } from './services/storageService.js';

mongoose.connect('mongodb+srv://divyanshu_db_user:n3e8ED1tVu2cZ1qu@cluster0.dmdnpub.mongodb.net/amazon_relife?appName=Cluster0').then(async () => {
  await new Promise(r => setTimeout(r, 1000));
  
  const buffer = Buffer.from('fake image data');
  const file = { originalname: 'test.jpg', mimetype: 'image/jpeg', buffer };
  const res = await StorageService.uploadFile(file);
  console.log('Uploaded ID:', res.id);
  
  try {
    const info = await StorageService.getFileInfo(res.id);
    console.log('File Info:', info);
    
    const stream = StorageService.getFileStream(res.id);
    let data = '';
    stream.on('data', chunk => data += chunk);
    stream.on('end', () => {
      console.log('Stream ended. Data length:', data.length);
      process.exit(0);
    });
    stream.on('error', (err) => {
      console.log('Stream Error:', err);
      process.exit(1);
    });
  } catch (e) {
    console.log('Error fetching:', e);
    process.exit(1);
  }
}).catch(console.error);
