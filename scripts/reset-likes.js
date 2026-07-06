const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function resetLikes() {
  await prisma.character.updateMany({
    data: {
      likes: 0
    }
  });
  console.log('Successfully reset all character likes to 0');
}

resetLikes()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
