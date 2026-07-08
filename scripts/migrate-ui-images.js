const { UTApi } = require("uploadthing/server");
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const filesToProcess = [
  '../src/app/page.tsx',
  '../src/app/buzz/page.tsx',
  '../src/app/fan/page.tsx'
];

async function run() {
  const utapi = new UTApi();
  
  for (const relativePath of filesToProcess) {
    const fullPath = path.join(__dirname, relativePath);
    console.log(`\nProcessing ${fullPath}...`);
    
    if (!fs.existsSync(fullPath)) {
      console.warn(`File not found: ${fullPath}`);
      continue;
    }
    
    let content = fs.readFileSync(fullPath, 'utf-8');
    const cloudinaryRegex = /https:\/\/res\.cloudinary\.com\/[^'"`\s)]+/g;
    const urls = content.match(cloudinaryRegex);
    
    if (!urls || urls.length === 0) {
      console.log("No Cloudinary URLs found.");
      continue;
    }
    
    console.log(`Found ${urls.length} URLs to migrate.`);
    const uniqueUrls = [...new Set(urls)];
    
    for (const url of uniqueUrls) {
      console.log(`Migrating: ${url}`);
      try {
        const response = await utapi.uploadFilesFromUrl(url);
        if (response.error) {
          console.error(`Failed to upload ${url}:`, response.error);
          continue;
        }
        const newUrl = response.data.url;
        console.log(`✅ Success: ${newUrl}`);
        
        content = content.replaceAll(url, newUrl);
      } catch(e) {
        console.error(`Exception while uploading ${url}:`, e);
      }
    }
    
    fs.writeFileSync(fullPath, content, 'utf-8');
    console.log(`✅ Updated ${relativePath}!`);
  }
}

run().catch(console.error);
