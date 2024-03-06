const express = require('express');
const qr = require('qr-image');
const bodyParser = require('body-parser');
const cloudinary = require('./cloudinaryConfig'); // Ensure this file exports your configured Cloudinary instance

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// POST endpoint to generate and upload QR code
app.post('/generate-qr', async (req, res) => {
  try {
    // Receive unique ID
    const { uniqueID } = req.body;

    // Check if uniqueID is provided
    if (!uniqueID) {
      return res.status(400).send('uniqueID is required');
    }

    // Generate QR code
    const pngBuffer = qr.imageSync(uniqueID, { type: 'png' });

    // Upload the QR code image to Cloudinary
    const qrCodeUrl = await uploadQRCodeToCloudinary(pngBuffer);

    // Return the URL in the response
    res.json({ qrCodeUrl });
  } catch (error) {
    console.error('Error processing your request:', error);
    res.status(500).send('Error processing your request');
  }
});

async function uploadQRCodeToCloudinary(imageBuffer) {
  try {
    // Convert the image buffer to a Base64 string for upload
    const imageBase64 = `data:image/png;base64,${imageBuffer.toString('base64')}`;
    const result = await cloudinary.uploader.upload(imageBase64);
    return result.url; // Return the URL of the uploaded image
  } catch (error) {
    console.error('Failed to upload image to Cloudinary:', error);
    throw error; // It's generally a bad practice to throw errors in async functions without proper handling
  }
}

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

