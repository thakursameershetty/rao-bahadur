const { UTApi } = require("uploadthing/server");
require('dotenv').config({ path: '.env.local' });

async function run() {
  const utapi = new UTApi();
  const result = await utapi.uploadFilesFromUrl(
    "https://res.cloudinary.com/uohqyl93/image/upload/raobahadur/characters/Rao-Bahadur.jpg"
  );
  console.log(result);
}
run().catch(console.error);
