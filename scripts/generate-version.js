import { execSync } from 'child_process';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

let version;
try {
  version = execSync('git rev-parse --short HEAD').toString().trim();
} catch {
  version = 'dev-' + Date.now();
}

const outputPath = join(__dirname, '../public/api/version.json');
const content = JSON.stringify({ version, timestamp: new Date().toISOString() }, null, 2);

writeFileSync(outputPath, content);
console.log('Generated version:', version);
