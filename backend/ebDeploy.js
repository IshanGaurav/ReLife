import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { ElasticBeanstalkClient, CreateStorageLocationCommand, CreateApplicationVersionCommand, UpdateEnvironmentCommand, DescribeEnvironmentsCommand } from '@aws-sdk/client-elastic-beanstalk';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

const config = {
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
};

const ebClient = new ElasticBeanstalkClient(config);
const s3Client = new S3Client(config);

const appName = 'secondLife-backend';
const envName = 'SecondLife-backend-env';
const versionLabel = 'v2-' + Date.now();
const zipPath = path.join(process.cwd(), '..', 'backend-deployment.zip');

async function deploy() {
  try {
    console.log('1. Fetching Elastic Beanstalk S3 bucket...');
    const storageRes = await ebClient.send(new CreateStorageLocationCommand({}));
    const bucket = storageRes.S3Bucket;
    console.log(`Using bucket: ${bucket}`);

    console.log('2. Uploading deployment zip file to S3...');
    const fileStream = fs.createReadStream(zipPath);
    const s3Key = `deployments/${versionLabel}.zip`;
    await s3Client.send(new PutObjectCommand({
      Bucket: bucket,
      Key: s3Key,
      Body: fileStream,
    }));
    console.log('Upload complete.');

    console.log(`3. Registering new application version (${versionLabel})...`);
    await ebClient.send(new CreateApplicationVersionCommand({
      ApplicationName: appName,
      VersionLabel: versionLabel,
      SourceBundle: { S3Bucket: bucket, S3Key: s3Key },
      Process: true,
    }));
    console.log('Application version registered.');

    console.log('4. Instructing Elastic Beanstalk to update environment...');
    await ebClient.send(new UpdateEnvironmentCommand({
      ApplicationName: appName,
      EnvironmentName: envName,
      VersionLabel: versionLabel,
    }));
    console.log('Update initiated. Polling for completion (this takes 2-3 minutes)...');

    let domain = null;
    let isFinished = false;
    while (!isFinished) {
      const descRes = await ebClient.send(new DescribeEnvironmentsCommand({
        EnvironmentNames: [envName]
      }));
      const envInfo = descRes.Environments[0];
      
      console.log(` -> Status: ${envInfo.Status} | Health: ${envInfo.Health}`);
      if (envInfo.Status === 'Ready') {
        if (envInfo.Health === 'Green') {
          domain = envInfo.CNAME;
          console.log(`\n✅ Deployment successful! API is live at: ${domain}`);
          isFinished = true;
        } else if (envInfo.Health === 'Red' || envInfo.Health === 'Yellow') {
          console.log(`\n❌ Deployment finished but health is ${envInfo.Health}.`);
          domain = envInfo.CNAME;
          isFinished = true;
        }
      }
      
      if (!isFinished) {
        await new Promise(resolve => setTimeout(resolve, 10000));
      }
    }

    if (domain) {
      console.log('5. Updating frontend .env file with live API URL...');
      const frontendEnvPath = path.join(process.cwd(), '..', 'frontend', '.env');
      let frontendEnv = fs.existsSync(frontendEnvPath) ? fs.readFileSync(frontendEnvPath, 'utf8') : '';
      frontendEnv = frontendEnv.replace(/VITE_API_BASE_URL=.*/g, '');
      frontendEnv = frontendEnv.trim() + `\nVITE_API_BASE_URL=http://${domain}/api\n`;
      fs.writeFileSync(frontendEnvPath, frontendEnv);
      console.log('Frontend updated.');
    }

  } catch (err) {
    console.error('Deployment failed:', err);
  }
}

deploy();
