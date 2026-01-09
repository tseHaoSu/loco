import { chromium, type FullConfig } from '@playwright/test';
import { globalAuthSetup } from './fixtures/auth.fixture';
import * as path from 'path';
import * as fs from 'fs';

async function globalSetup(config: FullConfig) {
  const authDir = path.join(__dirname, '.auth');
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  const baseURL = config.use?.baseURL || 'http://localhost:3000';

  // Wait for server to be ready
  const maxRetries = 30;
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(baseURL);
      if (response.ok) break;
    } catch {
      if (i === maxRetries - 1) {
        throw new Error(`Server not ready after ${maxRetries} attempts`);
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  const browser = await chromium.launch({ headless: true });

  try {
    await globalAuthSetup(browser, baseURL);
  } finally {
    await browser.close();
  }
}

export default globalSetup;
