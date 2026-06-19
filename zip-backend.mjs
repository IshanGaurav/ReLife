import fs from 'fs';
import path from 'path';

async function run() {
  const archiverModule = await import('archiver');
  const archiver = archiverModule.default || archiverModule;
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

  await archive.finalize();
}

run();
