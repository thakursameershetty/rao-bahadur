const cloudinary = require('cloudinary').v2;
const path = require('path');

// This requires the CLOUDINARY_URL environment variable to be set.
// e.g. export CLOUDINARY_URL="cloudinary://API_KEY:API_SECRET@CLOUD_NAME"

const charactersDir = path.join(__dirname, '../public/characters');
const files = ['Achamma.jpg', 'Achari.jpg', 'Kusuma.jpg', 'Renuka.jpg'];

async function uploadImages() {
  if (!process.env.CLOUDINARY_URL) {
    console.error("❌ Error: CLOUDINARY_URL environment variable is missing.");
    console.log("Please run this script with your Cloudinary URL like so:");
    console.log('CLOUDINARY_URL="cloudinary://API_KEY:API_SECRET@CLOUD_NAME" node scripts/upload-characters.js');
    process.exit(1);
  }

  for (const file of files) {
    const filePath = path.join(charactersDir, file);
    try {
      console.log(`Uploading ${file}...`);
      const result = await cloudinary.uploader.upload(filePath, {
        folder: 'raobahadur/characters',
        use_filename: true,
        unique_filename: false,
        overwrite: true,
      });
      console.log(`✅ Uploaded ${file}: ${result.secure_url}`);
    } catch (error) {
      console.error(`❌ Failed to upload ${file}:`, error);
    }
  }
}

uploadImages();
