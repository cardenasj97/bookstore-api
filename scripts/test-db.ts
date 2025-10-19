#!/usr/bin/env tsx
import { execSync } from 'child_process';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { dirname } from 'path';

const STATE_FILE = '.test-db-state.json';
const TEST_COMPOSE_FILE = 'docker-compose.test.yml';

interface DbState {
  running: boolean;
  startedAt?: string;
  containerId?: string;
}

function readState(): DbState {
  if (!existsSync(STATE_FILE)) {
    return { running: false };
  }
  return JSON.parse(readFileSync(STATE_FILE, 'utf-8'));
}

function writeState(state: DbState) {
  writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

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

function startDb() {
  console.log('🚀 Starting test database...');
  
  const containerName = 'bookstore_test_db';
  
  // Check if already running
  if (isContainerRunning(containerName)) {
    console.log('✅ Test database is already running');
    writeState({ 
      running: true, 
      startedAt: new Date().toISOString(),
      containerId: containerName
    });
    return;
  }

  // Start the container
  exec(`docker compose -f ${TEST_COMPOSE_FILE} up -d`);
  
  // Wait for database to be ready
  console.log('⏳ Waiting for database to be ready...');
  let retries = 30;
  while (retries > 0) {
    try {
      exec(
        `docker exec ${containerName} pg_isready -U postgres`,
        true
      );
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

  // Give it an extra second for the database to be fully ready
  exec('sleep 2', true);

  // Run migrations
  console.log('📦 Running migrations...');
  try {
    exec('DATABASE_URL=postgresql://postgres:postgres@localhost:5433/bookstore_test npx prisma migrate deploy');
  } catch (error) {
    console.error('❌ Failed to run migrations. Try running:');
    console.error('   DATABASE_URL=postgresql://postgres:postgres@localhost:5433/bookstore_test npx prisma migrate deploy');
    process.exit(1);
  }
  
  writeState({ 
    running: true, 
    startedAt: new Date().toISOString(),
    containerId: containerName
  });
  
  console.log('✅ Test database is ready!');
  console.log(`   Connection: postgresql://postgres:postgres@localhost:5433/bookstore_test`);
}

function stopDb() {
  console.log('🛑 Stopping test database...');
  
  const containerName = 'bookstore_test_db';
  
  if (!isContainerRunning(containerName)) {
    console.log('ℹ️  Test database is not running');
    writeState({ running: false });
    return;
  }

  exec(`docker compose -f ${TEST_COMPOSE_FILE} down -v`);
  writeState({ running: false });
  
  console.log('✅ Test database stopped');
}

function statusDb() {
  const state = readState();
  const containerName = 'bookstore_test_db';
  const actuallyRunning = isContainerRunning(containerName);
  
  if (actuallyRunning) {
    console.log('✅ Test database is RUNNING');
    if (state.startedAt) {
      console.log(`   Started at: ${state.startedAt}`);
    }
    console.log(`   Container: ${containerName}`);
    console.log(`   Connection: postgresql://postgres:postgres@localhost:5433/bookstore_test`);
  } else {
    console.log('❌ Test database is NOT RUNNING');
  }
  
  // Fix state if out of sync
  if (state.running !== actuallyRunning) {
    writeState({ running: actuallyRunning });
  }
}

function main() {
  const command = process.argv[2];

  switch (command) {
    case 'start':
      startDb();
      break;
    case 'stop':
      stopDb();
      break;
    case 'restart':
      stopDb();
      startDb();
      break;
    case 'status':
      statusDb();
      break;
    default:
      console.log(`
Usage: npm run test:db <command>

Commands:
  start    Start the test database
  stop     Stop the test database
  restart  Restart the test database
  status   Check test database status
      `);
      process.exit(1);
  }
}

main();

