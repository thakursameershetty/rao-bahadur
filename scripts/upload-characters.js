const { UTApi } = require("uploadthing/server");
const path = require('path');
const fs = require('fs');

// Note: Run this script using Node's native env file support:
// node --env-file=.env.local scripts/upload-characters.js

const charactersDir = path.join(__dirname, '../public/characters');
const files = ['Achamma.jpg', 'Achari.jpg', 'Kusuma.jpg', 'Renuka.jpg'];

async function uploadImages() {
  if (!process.env.UPLOADTHING_TOKEN) {
    console.error("❌ Error: UPLOADTHING_TOKEN environment variable is missing in .env.local");
    process.exit(1);
  }

  const utapi = new UTApi();

  for (const fileName of files) {
    const filePath = path.join(charactersDir, fileName);
    
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️ Warning: File not found: ${filePath}`);
      continue;
    }

    try {
      console.log(`Uploading ${fileName} to UploadThing...`);
      
      const buffer = fs.readFileSync(filePath);
      
      // Node 20+ has global File
      const fileObj = new File([buffer], fileName, { type: 'image/jpeg' });
      
      const response = await utapi.uploadFiles([fileObj]);
      
      if (response[0].error) {
        throw new Error(response[0].error.message);
      }
      
      console.log(`✅ Uploaded ${fileName}: ${response[0].data.url}`);
    } catch (error) {
      console.error(`❌ Failed to upload ${fileName}:`, error);
    }
  }
}

uploadImages();
