const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const output = fs.createWriteStream(path.join(process.cwd(), 'backend-deployment.zip'));
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', () => {
  console.log(`Successfully zipped! Total bytes: ${archive.pointer()}`);
});

archive.on('error', (err) => {
  throw err;
});

archive.pipe(output);

// Glob pattern to zip everything in the backend directory except node_modules
archive.glob('**/*', {
  cwd: path.join(process.cwd(), 'backend'),
  ignore: ['node_modules/**']
});

archive.finalize();
