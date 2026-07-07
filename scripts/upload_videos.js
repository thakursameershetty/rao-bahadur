const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');


cloudinary.config({
  cloud_name: 'uohqyl93', // Extracted from URL: cloudinary://key:secret@uohqyl93
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function uploadVideos() {
  const publicDir = path.join(__dirname, '../public');
  const videos = ['anand_devarakonda_compressed.mp4'];

  for (const video of videos) {
    const videoPath = path.join(publicDir, video);
    if (fs.existsSync(videoPath)) {
      console.log(`Uploading ${video}...`);
      try {
        const result = await cloudinary.uploader.upload(videoPath, {
          resource_type: "video",
          folder: "raobahadur"
        });
        console.log(`Uploaded ${video}: ${result.secure_url}`);
      } catch (error) {
        console.error(`Error uploading ${video}:`, error);
      }
    } else {
      console.log(`File ${videoPath} not found.`);
    }
  }
}

uploadVideos();