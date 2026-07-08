const { UTApi } = require("uploadthing/server");
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

async function run() {
  const utapi = new UTApi();
  const prisma = new PrismaClient();

  console.log("Migrating videos in the database...");
  const videos = await prisma.celebrityVideo.findMany();

  for (const video of videos) {
    let updated = false;
    let newSrc = video.src;
    let newPoster = video.poster;

    if (video.src.includes('res.cloudinary.com')) {
      console.log(`Migrating video src: ${video.title}`);
      try {
        const response = await utapi.uploadFilesFromUrl(video.src);
        if (response.error) throw new Error(response.error.message);
        newSrc = response.data.url;
        console.log(`✅ Success (src): ${newSrc}`);
        updated = true;
      } catch (e) {
        console.error(`❌ Failed to upload src ${video.src}:`, e);
      }
    }

    if (video.poster && video.poster.includes('res.cloudinary.com')) {
      console.log(`Migrating video poster: ${video.title}`);
      try {
        const response = await utapi.uploadFilesFromUrl(video.poster);
        if (response.error) throw new Error(response.error.message);
        newPoster = response.data.url;
        console.log(`✅ Success (poster): ${newPoster}`);
        updated = true;
      } catch (e) {
        console.error(`❌ Failed to upload poster ${video.poster}:`, e);
      }
    }

    if (updated) {
      await prisma.celebrityVideo.update({
        where: { id: video.id },
        data: { src: newSrc, poster: newPoster }
      });
      console.log(`✅ Updated DB record for ${video.title}`);
    }
  }

  console.log("\nMigrating scripts/seed_videos.ts...");
  const seedPath = path.join(__dirname, 'seed_videos.ts');
  if (fs.existsSync(seedPath)) {
    let content = fs.readFileSync(seedPath, 'utf-8');
    const cloudinaryRegex = /https:\/\/res\.cloudinary\.com\/[^'"`\s)]+/g;
    const urls = content.match(cloudinaryRegex);

    if (urls) {
      const uniqueUrls = [...new Set(urls)];
      for (const url of uniqueUrls) {
        console.log(`Migrating seed URL: ${url}`);
        try {
          const response = await utapi.uploadFilesFromUrl(url);
          if (response.error) throw new Error(response.error.message);
          const newUrl = response.data.url;
          console.log(`✅ Success: ${newUrl}`);
          content = content.replaceAll(url, newUrl);
        } catch (e) {
          console.error(`❌ Failed to upload seed URL ${url}:`, e);
        }
      }
      fs.writeFileSync(seedPath, content, 'utf-8');
      console.log(`✅ Updated seed_videos.ts!`);
    } else {
      console.log("No Cloudinary URLs found in seed_videos.ts");
    }
  }

  await prisma.$disconnect();
  console.log("Migration complete!");
}

run().catch(console.error);
