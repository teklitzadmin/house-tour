const puppeteer = require('puppeteer-core');
const path = require('path');

const framesToTest = [50, 100, 125, 155, 185, 215, 245, 265, 285];
const absoluteArtifactDir = 'C:\\Users\\ELCOT\\.gemini\\antigravity-ide\\brain\\a311a786-0a65-474d-a7bb-c60053ba453e';

(async () => {
  console.log("Launching Edge browser from workspace...");
  const browser = await puppeteer.launch({
    executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    headless: true,
    args: ['--disable-gpu', '--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  for (const frame of framesToTest) {
    const destPath = path.join(absoluteArtifactDir, `screenshot_${frame}.png`);
    const url = `http://localhost:3000/?frame=${frame}`;
    
    console.log(`Navigating to ${url}...`);
    await page.goto(url, { waitUntil: 'load' });
    
    // Wait for LERP rendering and image load
    await new Promise(r => setTimeout(r, 1500));
    
    console.log(`Saving frame ${frame} screenshot to ${destPath}`);
    await page.screenshot({ path: destPath });
  }

  await browser.close();
  console.log("All screenshots captured successfully.");
})().catch(err => {
  console.error("Puppeteer automation failed:", err);
});
