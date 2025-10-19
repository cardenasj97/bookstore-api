import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';

interface DbState {
  running: boolean;
  startedAt?: string;
  containerId?: string;
}

/**
 * Checks if the test database is running
 * @returns true if the test database is running, false otherwise
 */
export function isTestDatabaseRunning(): boolean {
  const STATE_FILE = '.test-db-state.json';
  const CONTAINER_NAME = 'bookstore_test_db';

  // First check the state file
  if (existsSync(STATE_FILE)) {
    try {
      const state: DbState = JSON.parse(readFileSync(STATE_FILE, 'utf-8'));
      if (!state.running) {
        return false;
      }
    } catch {
      // If state file is corrupted, fall through to docker check
    }
  }

  // Verify with docker
  try {
    const output = execSync(
      `docker ps --filter "name=${CONTAINER_NAME}" --format "{{.Names}}"`,
      { encoding: 'utf-8', stdio: 'pipe' }
    );
    return output.trim() === CONTAINER_NAME;
  } catch {
    return false;
  }
}

/**
 * Gets a human-readable message about the test database status
 */
export function getTestDatabaseMessage(): string {
  if (isTestDatabaseRunning()) {
    return '✅ Test database is running';
  }
  return `
❌ Test database is not running

To start the test database, run:
  npm run test:db start

Then run your tests with:
  npm test
  `;
}

