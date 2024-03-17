// const express = require('express');
// const qr = require('qr-image');
// const bodyParser = require('body-parser');
// const cloudinary = require('../cloudinaryConfig'); 
// const app = express();
// const port = 3000;

// app.use(bodyParser.json());

// app.post('/generate-qr', async (req, res) => {
//   try {
//     const { uniqueID } = req.body;

//     if (!uniqueID) {
//       return res.status(400).send('uniqueID is required');
//     }

//     const pngBuffer = qr.imageSync(uniqueID, { type: 'png' });

//     const qrCodeUrl = await uploadQRCodeToCloudinary(pngBuffer);

//     res.json({ qrCodeUrl });
//   } catch (error) {
//     console.error('Error processing your request:', error);
//     res.status(500).send('Error processing your request');
//   }
// });

// async function uploadQRCodeToCloudinary(imageBuffer) {
//   try {
//     const imageBase64 = `data:image/png;base64,${imageBuffer.toString('base64')}`;
//     const result = await cloudinary.uploader.upload(imageBase64);
//     return result.url; 
//   } catch (error) {
//     console.error('Failed to upload image to Cloudinary:', error);
//     throw error; 
//   }
// }

// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });


const express = require('express');
const qr = require('qr-image');
const sharp = require('sharp');
const bodyParser = require('body-parser');
const cloudinary = require('../cloudinaryConfig');
const app = express();
const port = 8000;

app.use(bodyParser.json());

app.post('/generate-qr', async (req, res) => {
  try {
    const { uniqueID } = req.body;

    if (!uniqueID) {
      return res.status(400).send('uniqueID is required');
    }

    // Generate QR code
    const qrCodeBuffer = qr.imageSync(uniqueID, { type: 'png' });

    // Load your event ticket template (Ensure the path is correct)
    const ticketTemplatePath = './event-ticket-template.png';
    const ticketWithQRCode = await sharp(ticketTemplatePath)
      // Ensure you adjust these values to position the QR code correctly on your template
      .composite([{ input: qrCodeBuffer, left: 1580, top: 100 }])
      .png()
      .toBuffer();

    // Upload the final ticket image with QR code to Cloudinary
    const ticketUrl = await uploadImageToCloudinary(ticketWithQRCode);

    res.json({ ticketUrl });
  } catch (error) {
    console.error('Error processing your request:', error);
    res.status(500).send('Error processing your request');
  }
});

async function uploadImageToCloudinary(imageBuffer) {
  try {
    const imageBase64 = `data:image/png;base64,${imageBuffer.toString('base64')}`;
    const result = await cloudinary.uploader.upload(imageBase64);
    return result.url;
  } catch (error) {
    console.error('Failed to upload image to Cloudinary:', error);
    throw error;
  }
}

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

