/* =========================================================
   EXECUTIVE SUMMARY → PDF
   Renders executive-summary/index.html to a PDF with Chrome,
   using the print styles (assets/components/print.css).

   Used in two ways:
   1. npm run dev  → vite.config.js serves a fresh PDF on every
      click of the navbar button (always matches the page).
   2. npm run pdf  → writes the file next to the page:
      executive-summary/Yearbook-of-Global-Climate-Action-2026-Executive-Summary.pdf
      (also runs automatically before npm run build).

   Needs: npm install (playwright-core) and Google Chrome.
   Without Chrome: npx playwright install chromium
   ========================================================= */

import http from 'node:http';
import { readFile, writeFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const PDF_NAME = 'Yearbook-of-Global-Climate-Action-2026-Executive-Summary.pdf';
export const PDF_PATH = `/executive-summary/${PDF_NAME}`;   // URL used by the navbar button

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

/* --- Open Chrome (installed Chrome first, then Playwright's own Chromium) --- */
async function launchBrowser() {
  const { chromium } = await import('playwright-core');
  for (const options of [{ channel: 'chrome' }, { channel: 'msedge' }, {}]) {
    try { return await chromium.launch(options); } catch { /* try the next one */ }
  }
  throw new Error('No browser found for the PDF. Install Google Chrome, or run: npx playwright install chromium');
}

/* --- Render one page URL to PDF bytes --- */
export async function renderSummaryPdf(url) {
  const browser = await launchBrowser();
  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.evaluate(async () => {
      // load lazy images and web fonts before printing
      document.querySelectorAll('img[loading="lazy"]').forEach(img => { img.loading = 'eager'; });
      await Promise.all([...document.images].map(img => img.complete ? null : new Promise(r => { img.onload = img.onerror = r; })));
      await document.fonts.ready;
    });
    return await page.pdf({ format: 'A4', printBackground: true, preferCSSPageSize: true });
  } finally {
    await browser.close();
  }
}

/* --- Tiny static server for the project folder (used by npm run pdf) --- */
const TYPES = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.ico': 'image/x-icon', '.pdf': 'application/pdf'
};

function serveFolder(folder) {
  const server = http.createServer(async (req, res) => {
    try {
      let file = normalize(join(folder, decodeURIComponent(new URL(req.url, 'http://x').pathname)));
      if (!file.startsWith(folder)) throw new Error('outside');
      if ((await stat(file)).isDirectory()) file = join(file, 'index.html');
      res.writeHead(200, { 'Content-Type': TYPES[extname(file)] || 'application/octet-stream' });
      res.end(await readFile(file));
    } catch {
      res.writeHead(404); res.end();
    }
  });
  return new Promise(ok => server.listen(0, '127.0.0.1', () => ok(server)));
}

/* --- npm run pdf --- */
async function main() {
  const server = await serveFolder(ROOT);
  const { port } = server.address();
  try {
    const pdf = await renderSummaryPdf(`http://127.0.0.1:${port}/executive-summary/`);
    const out = join(ROOT, 'executive-summary', PDF_NAME);
    await writeFile(out, pdf);
    console.log(`PDF saved: executive-summary/${PDF_NAME}`);
  } finally {
    server.close();
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(err => { console.error(err.message); process.exit(1); });
}
