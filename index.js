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
  const startTime = Date.now();
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
    const processingTime = Date.now() - startTime;

    // Prepare data for n8n extraction
    const extractionData = {
      filename: req.file.originalname,
      format: req.file.mimetype,
      original: { size: originalsize },
      optimized: { 
        size: optimizedSize, 
        url: optimizedUrl 
      },
      cloudinary_result: {
        public_id: result.public_id,
        resource_type: result.resource_type,
        created_at: result.created_at,
        width: result.width,
        height: result.height,
        duration: result.duration
      },
      transformation: { width: 1080, crop: 'scale', quality: 'auto' },
      processing_time: processingTime
    };

    // Send data to n8n webhook for extraction (if webhook URL is configured)
    if (process.env.N8N_WEBHOOK_URL) {
      try {
        const webhookResponse = await fetch(process.env.N8N_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(extractionData)
        });
        console.log('Data sent to n8n extraction workflow:', await webhookResponse.text());
      } catch (webhookError) {
        console.error('Failed to send data to n8n webhook:', webhookError);
      }
    }

    res.render('index', {
      original: {size: originalsize },
      optimized: {size: optimizedSize,url: optimizedUrl },
    });

  } catch (err) {
    console.error('Upload error:', err);
    
    // Send error data to n8n for failed processing tracking
    if (process.env.N8N_WEBHOOK_URL) {
      try {
        const errorData = {
          filename: req.file?.originalname || 'unknown',
          error: err.message,
          processing_time: Date.now() - startTime,
          status: 'failed'
        };
        await fetch(process.env.N8N_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(errorData)
        });
      } catch (webhookError) {
        console.error('Failed to send error data to n8n webhook:', webhookError);
      }
    }
    
    res.send('Video upload failed');
  }
});

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
