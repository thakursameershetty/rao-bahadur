const { UTApi } = require("uploadthing/server");
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

async function run() {
  const utapi = new UTApi();

  const storePath = path.join(__dirname, '../src/store/useCharactersStore.ts');
  let storeContent = fs.readFileSync(storePath, 'utf-8');

  // Extract all cloudinary URLs from the file
  const cloudinaryRegex = /https:\/\/res\.cloudinary\.com\/[^'"]+/g;
  const urls = storeContent.match(cloudinaryRegex);

  if (!urls) {
    console.log("No cloudinary URLs found!");
    return;
  }

  console.log(`Found ${urls.length} URLs to migrate.`);

  // Create a Set to unique the URLs just in case
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

      // Replace in content
      storeContent = storeContent.replaceAll(url, newUrl);
    } catch (e) {
      console.error(`Exception while uploading ${url}:`, e);
    }
  }

  fs.writeFileSync(storePath, storeContent, 'utf-8');
  console.log("✅ Updated useCharactersStore.ts!");
}

run().catch(console.error);
