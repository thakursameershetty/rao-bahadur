const { UTApi } = require("uploadthing/server");
const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: '.env.local' });

const CELEBRITY_VIDEOS = [
  { src: "https://res.cloudinary.com/uohqyl93/video/upload/raobahadur/event/videos/Sukumar_compressed.mp4", title: "Sukumar" },
  { src: "https://res.cloudinary.com/uohqyl93/video/upload/raobahadur/event/videos/Naga_Chaitanya_compressed.mp4", title: "Naga Chaitanya" },
  {
    src: "https://res.cloudinary.com/uohqyl93/video/upload/v1783436194/raobahadur/xbkbvoxsi09ayt631u1i.mp4",
    title: "Anand Devarakonda",
    poster: "https://res.cloudinary.com/uohqyl93/video/upload/so_0.965/v1783436194/raobahadur/xbkbvoxsi09ayt631u1i.jpg"
  },
  {
    src: "https://res.cloudinary.com/uohqyl93/video/upload/raobahadur/event/videos/Rahul_Ravindran.mp4",
    title: "Rahul Ravindran",
    poster: "https://res.cloudinary.com/uohqyl93/video/upload/so_7.06/raobahadur/event/videos/Rahul_Ravindran.jpg"
  },
  { src: "https://res.cloudinary.com/uohqyl93/video/upload/raobahadur/event/videos/vivek_athreya.mp4", title: "Vivek Athreya" },
  {
    src: "https://res.cloudinary.com/uohqyl93/video/upload/raobahadur/event/videos/Hollywood_Reporter.mp4",
    title: "Hollywood Reporter",
    poster: "https://res.cloudinary.com/uohqyl93/video/upload/so_5.0/raobahadur/event/videos/Hollywood_Reporter.jpg"
  },
  { src: "https://res.cloudinary.com/uohqyl93/video/upload/raobahadur/event/videos/Critics.mp4", title: "Critics" },
  { src: "https://res.cloudinary.com/uohqyl93/video/upload/raobahadur/event/videos/RB_public_Review_Plain.mp4", title: "Public Review" }
];

async function run() {
  const utapi = new UTApi();
  const prisma = new PrismaClient();
  
  const videos = await prisma.celebrityVideo.findMany();
  
  for (const video of videos) {
    const originalInfo = CELEBRITY_VIDEOS.find(v => v.title === video.title);
    if (!originalInfo) continue;
    
    // Check if poster is already set and not cloudinary
    if (video.poster && !video.poster.includes('cloudinary')) {
      console.log(`Poster already fine for ${video.title}`);
      continue;
    }
    
    const targetPosterUrl = originalInfo.poster || originalInfo.src.replace('.mp4', '.jpg');
    console.log(`Uploading poster for ${video.title} from ${targetPosterUrl}`);
    
    try {
      const response = await utapi.uploadFilesFromUrl(targetPosterUrl);
      if (response.error) {
         console.error(`Failed to upload:`, response.error);
         continue;
      }
      
      const newPoster = response.data.url;
      await prisma.celebrityVideo.update({
        where: { id: video.id },
        data: { poster: newPoster }
      });
      console.log(`✅ Success: ${newPoster}`);
    } catch(e) {
      console.error(e);
    }
  }
  
  await prisma.$disconnect();
}

run().catch(console.error);
