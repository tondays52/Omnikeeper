import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

async function captureDemo() {
  console.log('================================================================');
  console.log('🎥 OmniKeeper — Automated Headless Browser Demo Capture');
  console.log('================================================================\n');

  const artifactDir = 'C:\\Users\\tonda\\.gemini\\antigravity-ide\\brain\\865cf8d6-d271-44b8-a33b-a297eae64d0b\\demo_screens';
  const docsDir = 'd:\\KeeperHub\\docs\\demo';
  
  fs.mkdirSync(artifactDir, { recursive: true });
  fs.mkdirSync(docsDir, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    defaultViewport: { width: 1440, height: 900 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  console.log('1. Navigating to http://localhost:5173/ ...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 2000));

  // Screenshot 1: Main Dashboard Overview
  console.log('📸 1/6 Capturing Main Dashboard Live Streaming Overview...');
  await page.screenshot({ path: path.join(artifactDir, '01_main_dashboard.png') });
  await page.screenshot({ path: path.join(docsDir, '01_main_dashboard.png') });

  // Screenshot 2: Scroll to Pre-Flight Simulator & Run Unhappy Path Simulation
  console.log('📸 2/6 Capturing Pre-Flight Simulation Revert Guard...');
  await page.evaluate(() => {
    window.scrollBy(0, 650);
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(artifactDir, '02_preflight_simulator_view.png') });
  await page.screenshot({ path: path.join(docsDir, '02_preflight_simulator_view.png') });

  // Screenshot 3: Open Black Swan Time-Travel Backtest Modal
  console.log('📸 3/6 Capturing Black Swan Time-Travel Engine...');
  await page.evaluate(() => {
    window.scrollTo(0, 0);
    const buttons = Array.from(document.querySelectorAll('button'));
    const btn = buttons.find(b => b.textContent?.includes('Time-Travel') || b.textContent?.includes('Black Swan'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(artifactDir, '03_black_swan_backtest_modal.png') });
  await page.screenshot({ path: path.join(docsDir, '03_black_swan_backtest_modal.png') });

  // Close Black Swan modal
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const closeBtn = buttons.find(b => b.textContent?.includes('Close') || b.textContent?.includes('Cancel') || b.textContent?.includes('×'));
    if (closeBtn) closeBtn.click();
  });
  await new Promise(r => setTimeout(r, 500));

  // Screenshot 4: Open Prompt-to-DAG Modal
  console.log('📸 4/6 Capturing Prompt-to-DAG Cloud Compiler...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const btn = buttons.find(b => b.textContent?.includes('Prompt-to-DAG'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(artifactDir, '04_prompt_to_dag_modal.png') });
  await page.screenshot({ path: path.join(docsDir, '04_prompt_to_dag_modal.png') });

  // Close Prompt-to-DAG modal
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const closeBtn = buttons.find(b => b.textContent?.includes('Close') || b.textContent?.includes('Cancel') || b.textContent?.includes('×'));
    if (closeBtn) closeBtn.click();
  });
  await new Promise(r => setTimeout(r, 500));

  // Screenshot 5: Open ElizaOS Co-Pilot Assistant Modal
  console.log('📸 5/6 Capturing ElizaOS Co-Pilot & KeeperHub MCP Assistant...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const btn = buttons.find(b => b.textContent?.includes('ElizaOS Co-Pilot'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(artifactDir, '05_elizaos_copilot_modal.png') });
  await page.screenshot({ path: path.join(docsDir, '05_elizaos_copilot_modal.png') });

  // Close Co-Pilot modal
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const closeBtn = buttons.find(b => b.textContent?.includes('Close') || b.textContent?.includes('Cancel') || b.textContent?.includes('×'));
    if (closeBtn) closeBtn.click();
  });
  await new Promise(r => setTimeout(r, 500));

  // Screenshot 6: Audit Trail Table & MEV Protection Telemetry
  console.log('📸 6/6 Capturing Execution SLA Audit Trail & MEV Protection View...');
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(artifactDir, '06_audit_trail_and_mev.png') });
  await page.screenshot({ path: path.join(docsDir, '06_audit_trail_and_mev.png') });

  await browser.close();
  console.log('\n🎉 ALL DEMO SCREENSHOTS & ASSETS CAPTURED SUCCESSFULLY!');
}

captureDemo().catch(console.error);
