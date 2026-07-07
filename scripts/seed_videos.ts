import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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

async function main() {
  const existingCount = await prisma.celebrityVideo.count();
  if (existingCount === 0) {
    for (let i = 0; i < CELEBRITY_VIDEOS.length; i++) {
      const video = CELEBRITY_VIDEOS[i];
      await prisma.celebrityVideo.create({
        data: {
          title: video.title,
          src: video.src,
          poster: video.poster || null,
          order: i,
        }
      });
    }
    console.log(`Seeded ${CELEBRITY_VIDEOS.length} videos`);
  } else {
    console.log(`Already has ${existingCount} videos, skipping seed.`);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
