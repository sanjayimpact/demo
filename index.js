import express from 'express';
import multer from 'multer';
import cloudinary from './cloudinary.js';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import 'dotenv/config';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

const upload = multer({ dest: 'uploads/' });

app.get('/', (req, res) => {
  res.render('index', { original: null, optimized: null });
});

app.post('/upload', upload.single('video'), async (req, res) => {
  try {
const result = await cloudinary.uploader.upload(req.file.path, {
  resource_type: 'video',
  eager: [
    {
      transformation: [
        { width: 1080, crop: 'scale', quality: 'auto' }
      ]
    }
  ],
  eager_async: false
});

      
      
      
    // Clean up local file
    fs.unlinkSync(req.file.path);
    console.log(result);

    console.log(result.eager[0].bytes);
    const originalsize = (result.bytes / (1024 * 1024)).toFixed(2)
    const originalUrl = result.secure_url;

    // Example optimization: auto format and quality, scale width to 720px
    const optimizedUrl = result.eager[0].secure_url;
    const optimizedSize = (result.eager[0].bytes / (1024 * 1024)).toFixed(2);    

    res.render('index', {
      original: {size: originalsize },
      optimized: {size: optimizedSize,url: optimizedUrl },
    });

  } catch (err) {
    console.error('Upload error:', err);
    res.send('Video upload failed');
  }
});

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
