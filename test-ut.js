const { UTApi } = require("uploadthing/server");
const fs = require('fs');

async function run() {
  const utapi = new UTApi();
  const buffer = fs.readFileSync('public/characters/Achamma.jpg');
  // File is global in node 20
  const file = new File([buffer], 'Achamma.jpg', { type: 'image/jpeg' });
  const result = await utapi.uploadFiles([file]);
  console.log(result);
}
run().catch(console.error);
