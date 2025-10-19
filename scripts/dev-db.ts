#!/usr/bin/env tsx
import { execSync } from 'child_process';

function exec(command: string, silent = false): string {
  try {
    return execSync(command, { 
      encoding: 'utf-8',
      stdio: silent ? 'pipe' : 'inherit'
    });
  } catch (error) {
    if (!silent) throw error;
    return '';
  }
}

function isContainerRunning(containerName: string): boolean {
  try {
    const output = exec(
      `docker ps --filter "name=${containerName}" --format "{{.Names}}"`,
      true
    );
    return output.trim() === containerName;
  } catch {
    return false;
  }
}

const containerName = 'bookstore_db';

if (!isContainerRunning(containerName)) {
  console.log('🚀 Starting dev database...');
  exec('docker compose up -d');
  
  // Wait for database to be ready
  console.log('⏳ Waiting for database to be ready...');
  let retries = 30;
  while (retries > 0) {
    try {
      exec(`docker exec ${containerName} pg_isready -U postgres`, true);
      break;
    } catch {
      retries--;
      if (retries === 0) {
        console.error('❌ Database failed to start');
        process.exit(1);
      }
      exec('sleep 1', true);
    }
  }
  
  console.log('✅ Dev database is ready!');
} else {
  console.log('✅ Dev database already running');
}

