const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({
  cloud_name: 'uohqyl93',
  api_key: '545344581256144',
  api_secret: 'oiMpmIPOfK09ITquByiL5kGOPHE',
  secure: true,
});

async function main() {
  try {
    const fullPath = 'public/event/videos/Rahul Ravindran.mp4';
    console.log(`Uploading ${fullPath}...`);

    cloudinary.uploader.upload_large(fullPath, {
      resource_type: "video",
      folder: 'raobahadur/event/videos',
      use_filename: true,
      unique_filename: false,
      overwrite: true,
      chunk_size: 6000000
    }, function (error, result) {
      if (error) {
        console.error('Error in callback:', error);
      } else {
        console.log('Result callback:', result);
        console.log('Secure URL:', result.secure_url);
      }
    });

  } catch (err) {
    console.error('Catch Error:', err);
  }
}

main();
