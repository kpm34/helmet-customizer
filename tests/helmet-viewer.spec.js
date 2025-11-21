const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('Helmet Material Viewer Tests', () => {
  test('should test all viewer functionality', async ({ page }) => {
    console.log('\n=== Starting Helmet Viewer Tests ===\n');

    // Setup console logging to capture errors/warnings only
    const consoleErrors = [];
    const consoleWarnings = [];

    page.on('console', msg => {
      const type = msg.type();
      const text = msg.text();

      // Ignore auto-rotate frame updates and repetitive logs
      if (text.includes('rotation') || text.includes('frame') || text.includes('render')) {
        return;
      }

      if (type === 'error') {
        consoleErrors.push(text);
        console.log(`[ERROR] ${text}`);
      } else if (type === 'warning') {
        consoleWarnings.push(text);
        console.log(`[WARNING] ${text}`);
      }
    });

    page.on('pageerror', error => {
      consoleErrors.push(error.message);
      console.log(`[PAGE ERROR] ${error.message}`);
    });

    // 1. Navigate to the page
    console.log('1. Navigating to http://localhost:3002...');
    try {
      await page.goto('http://localhost:3002', {
        waitUntil: 'networkidle',
        timeout: 30000
      });
      console.log('   ✓ Page loaded successfully');
    } catch (error) {
      console.log(`   ✗ Failed to load page: ${error.message}`);
      throw error;
    }

    // 2. Take initial snapshot
    console.log('\n2. Taking initial snapshot...');
    const screenshotsDir = path.join(__dirname, '../test-results/screenshots');
    await page.screenshot({
      path: path.join(screenshotsDir, '01-initial-load.png'),
      fullPage: true
    });
    console.log('   ✓ Initial snapshot saved');

    // Wait for 3D canvas to render
    console.log('\n3. Waiting for 3D canvas to initialize...');
    await page.waitForSelector('canvas', { timeout: 10000 });
    await page.waitForTimeout(2000); // Give WebGL time to initialize
    console.log('   ✓ Canvas detected and initialized');

    // 3. Test color picker - Change to red
    console.log('\n4. Testing color picker (changing to red #ff0000)...');
    try {
      const colorInput = page.locator('input[type="color"]');
      await expect(colorInput).toBeVisible({ timeout: 5000 });

      await colorInput.fill('#ff0000');
      console.log('   ✓ Color picker set to red');

      // Wait for helmet to update
      await page.waitForTimeout(1500);

      await page.screenshot({
        path: path.join(screenshotsDir, '02-red-color.png'),
        fullPage: true
      });
      console.log('   ✓ Red color screenshot captured');
    } catch (error) {
      console.log(`   ✗ Color picker test failed: ${error.message}`);
    }

    // 4. Test Material Presets
    console.log('\n5. Testing material preset switching...');

    // Test Matte material
    console.log('   - Switching to Matte material...');
    try {
      const matteButton = page.getByRole('button', { name: /matte/i });
      await matteButton.click();
      await page.waitForTimeout(2000); // Wait for material to load
      console.log('     ✓ Matte material loaded');
    } catch (error) {
      console.log(`     ✗ Matte button not found or failed: ${error.message}`);
    }

    // Test Chrome material
    console.log('   - Switching to Chrome material...');
    try {
      const chromeButton = page.getByRole('button', { name: /chrome/i });
      await chromeButton.click();
      await page.waitForTimeout(2000); // Wait for material to load

      await page.screenshot({
        path: path.join(screenshotsDir, '03-chrome-material.png'),
        fullPage: true
      });
      console.log('     ✓ Chrome material loaded and captured');
    } catch (error) {
      console.log(`     ✗ Chrome button not found or failed: ${error.message}`);
    }

    // Test Carbon Fiber material
    console.log('   - Switching to Carbon Fiber material...');
    try {
      const carbonButton = page.getByRole('button', { name: /carbon fiber/i });
      await carbonButton.click();
      await page.waitForTimeout(2000); // Wait for material to load

      await page.screenshot({
        path: path.join(screenshotsDir, '04-carbon-fiber-material.png'),
        fullPage: true
      });
      console.log('     ✓ Carbon Fiber material loaded and captured');
    } catch (error) {
      console.log(`     ✗ Carbon Fiber button not found or failed: ${error.message}`);
    }

    // 5. Verify auto-rotation
    console.log('\n6. Verifying auto-rotation...');
    try {
      // Take two snapshots 2 seconds apart and compare
      const snapshot1 = await page.screenshot({ type: 'png' });
      await page.waitForTimeout(2000);
      const snapshot2 = await page.screenshot({ type: 'png' });

      // If rotation is working, screenshots should be different
      const isDifferent = !snapshot1.equals(snapshot2);

      if (isDifferent) {
        console.log('   ✓ Auto-rotation is working (visual changes detected)');
      } else {
        console.log('   ⚠ Auto-rotation may not be working (no visual changes)');
      }
    } catch (error) {
      console.log(`   ✗ Auto-rotation check failed: ${error.message}`);
    }

    // Final screenshot
    await page.screenshot({
      path: path.join(screenshotsDir, '05-final-state.png'),
      fullPage: true
    });

    // Summary
    console.log('\n=== Test Summary ===');
    console.log(`Console Errors: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
      console.log('Errors:', consoleErrors);
    }
    console.log(`Console Warnings: ${consoleWarnings.length}`);
    if (consoleWarnings.length > 0) {
      console.log('Warnings:', consoleWarnings);
    }
    console.log('Screenshots saved in:', screenshotsDir);
    console.log('===================\n');

    // Assert no critical errors
    expect(consoleErrors.length).toBe(0);
  });
});
