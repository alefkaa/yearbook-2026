/* =========================================================
   UPLOAD FOLDER – npm run upload
   1. Makes a fresh Executive Summary PDF (same as npm run pdf)
   2. Copies only the website files into ../yearbook-2026-upload/
      (no node_modules, scripts, package files, git or system files)
   Send / upload the yearbook-2026-upload folder to the server.
   ========================================================= */

import { cp, rm, stat } from 'node:fs/promises';
import { basename, dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = resolve(ROOT, '..', 'yearbook-2026-upload');

// Files and folders that are only needed for working on the site, not on the server
const SKIP = new Set(['node_modules', '.git', '.gitignore', '.DS_Store', 'scripts',
  'package.json', 'package-lock.json', 'vite.config.js', 'dist']);

// 1. Fresh PDF (stops here if it fails, so an old PDF is never uploaded by mistake)
execFileSync(process.execPath, [join(ROOT, 'scripts', 'summary-pdf.js')], { stdio: 'inherit' });

// 2. Clean copy of the website
await rm(OUT, { recursive: true, force: true });
await cp(ROOT, OUT, {
  recursive: true,
  filter: src => {
    const name = basename(src);
    if (src === ROOT) return true;
    if (SKIP.has(name) || name.endsWith('.sh')) return false;
    return !relative(ROOT, src).startsWith('..');
  }
});

const pdf = join(OUT, 'executive-summary', 'Yearbook-of-Global-Climate-Action-2026-Executive-Summary.pdf');
await stat(pdf);   // make sure the PDF is in the upload folder
console.log(`Upload folder ready: ${OUT}`);
