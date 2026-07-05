const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

cloudinary.config({
  cloud_name: 'uohqyl93',
  api_key: '545344581256144',
  api_secret: 'oiMpmIPOfK09ITquByiL5kGOPHE',
  secure: true,
});

const mappings = {};

async function uploadDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (let entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await uploadDir(fullPath);
    } else if (entry.name !== '.DS_Store') {
      console.log(`Uploading ${fullPath}...`);
      try {
        const result = await cloudinary.uploader.upload(fullPath, {
          resource_type: "auto",
          folder: 'raobahadur' + dir.replace('public', ''),
          use_filename: true,
          unique_filename: false,
          overwrite: true
        });
        const localPath = fullPath.replace('public', '').replace(/\\/g, '/');
        mappings[localPath] = result.secure_url;
        console.log(`Uploaded to ${result.secure_url}`);
      } catch (err) {
        console.error(`Error uploading ${entry.name}:`, err.message);
      }
    }
  }
}

async function main() {
  console.log("Starting upload...");
  await uploadDir('public/event');
  fs.writeFileSync('cloudinary_mappings.json', JSON.stringify(mappings, null, 2));
  console.log('Upload complete, mappings saved to cloudinary_mappings.json');
}

main();
