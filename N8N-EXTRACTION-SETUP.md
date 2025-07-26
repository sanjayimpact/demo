# n8n Video Compression Data Extraction Workflow

This n8n workflow extracts and processes data from your video compression application, providing analytics, logging, and notifications for your video processing operations.

## Features

🎯 **Data Extraction**: Automatically extracts video metadata, compression ratios, and processing times
📊 **Analytics**: Calculates compression ratios and size reductions
📝 **Logging**: Stores processing data in Google Sheets for analysis
🔔 **Notifications**: Sends Slack alerts for failed processing
🔗 **API Integration**: Forwards extracted data to external APIs
📈 **Real-time Monitoring**: Tracks video processing in real-time

## Setup Instructions

### 1. Import the Workflow to n8n

1. Copy the content from `n8n-video-extraction-workflow.json`
2. In your n8n instance, go to **Workflows** → **Import from JSON**
3. Paste the workflow JSON and import

### 2. Configure Environment Variables

Add this to your `.env` file:

```env
# n8n Webhook URL (you'll get this after setting up the workflow)
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/video-webhook

# Existing Cloudinary config
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Configure n8n Nodes

#### Webhook Node
- The webhook is already configured with path: `video-webhook`
- Copy the webhook URL from n8n and add it to your `.env` file

#### Google Sheets Node (Optional)
1. Connect your Google account in n8n
2. Create a new Google Sheet with these columns:
   - timestamp
   - original_size_mb
   - optimized_size_mb
   - compression_ratio
   - size_reduction
   - download_url
   - filename
3. Replace `your-google-sheet-id` with your actual sheet ID

#### Slack Node (Optional)
1. Connect your Slack workspace in n8n
2. Choose the channel for notifications
3. The node will send alerts for failed video processing

#### HTTP Request Node (Optional)
- Replace `https://your-api-endpoint.com/video-processed` with your actual API endpoint
- This forwards extracted data to your external systems

## What Data Gets Extracted

The workflow extracts the following information:

```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "originalVideo": {
    "size_mb": "25.67",
    "filename": "sample_video.mp4",
    "format": "video/mp4"
  },
  "optimizedVideo": {
    "size_mb": "12.34",
    "url": "https://cloudinary.com/optimized-video-url",
    "compression_ratio": "51.93%",
    "size_reduction": "13.33 MB"
  },
  "processing": {
    "cloudinary_result": {
      "public_id": "video_abc123",
      "resource_type": "video",
      "created_at": "2024-01-15T10:30:00Z",
      "width": 1080,
      "height": 720,
      "duration": 120.5
    },
    "transformation_applied": {
      "width": 1080,
      "crop": "scale",
      "quality": "auto"
    },
    "processing_time": 15420
  }
}
```

## Testing the Integration

1. Start your Express application:
   ```bash
   npm start
   ```

2. Activate the n8n workflow

3. Upload a video through your web interface at `http://localhost:3000`

4. Check the n8n execution history to see the extracted data

5. Verify the data appears in your configured destinations (Google Sheets, Slack, etc.)

## Workflow Nodes Explained

1. **Webhook**: Receives data from your Express app
2. **Extract Video Data**: JavaScript code that processes and structures the data
3. **Check if Processing Successful**: Conditional logic to handle success/failure
4. **Log to Google Sheets**: Stores data for analytics
5. **Send to External API**: Forwards data to your systems
6. **Slack Notification**: Alerts for failed processing
7. **Respond to Webhook**: Sends confirmation back to your app

## Customization Options

### Add More Extraction Logic
Edit the JavaScript code in the "Extract Video Data" node to capture additional fields:

```javascript
// Add custom extraction logic
const extractedData = {
  // ... existing fields ...
  custom_metrics: {
    bitrate_reduction: calculateBitrateReduction(body),
    quality_score: assessVideoQuality(body),
    processing_efficiency: body.processing_time / body.original.size_mb
  }
};
```

### Add New Destinations
You can add more nodes to send data to:
- Database (MySQL, PostgreSQL, MongoDB)
- Email notifications
- Discord webhooks
- Other APIs or services

### Modify Triggers
Instead of webhooks, you could trigger the workflow with:
- File monitoring (watch upload folder)
- Scheduled execution (process batches)
- Manual triggers for testing

## Troubleshooting

### Webhook Not Receiving Data
- Check if `N8N_WEBHOOK_URL` is correctly set in `.env`
- Verify the webhook is activated in n8n
- Check Express app logs for webhook errors

### Google Sheets Not Updating
- Ensure Google Sheets credentials are properly configured
- Check if the sheet ID is correct
- Verify column names match the workflow

### Slack Notifications Not Working
- Confirm Slack app permissions
- Check channel configuration
- Verify the Slack webhook URL

## Use Cases

- **Video Analytics**: Track compression efficiency across different video types
- **Performance Monitoring**: Monitor processing times and system performance
- **Business Intelligence**: Generate reports on video usage and optimization
- **Quality Assurance**: Alert when compression ratios are unusually low/high
- **Compliance**: Log all video processing for audit trails
- **Integration**: Feed data into your existing analytics or CRM systems

## Next Steps

1. Set up the basic workflow with webhook integration
2. Configure Google Sheets for data logging
3. Add Slack notifications for monitoring
4. Customize the extraction logic for your specific needs
5. Integrate with your existing analytics tools