import { readFile } from 'node:fs/promises';
import { PDF_PATH, PDF_NAME, renderSummaryPdf } from './scripts/summary-pdf.js';

// Dev server: every click on "Download the Executive Summary" renders a fresh PDF
// from the current Executive Summary page (see scripts/summary-pdf.js).
// If the PDF can't be made (e.g. `npm install` not run yet), the saved file in
// executive-summary/ is sent instead, so the download is never a broken file.
const summaryPdf = {
  name: 'executive-summary-pdf',
  configureServer(server) {
    server.middlewares.use(PDF_PATH, async (req, res) => {
      let pdf;
      try {
        const base = server.resolvedUrls.local[0];               // e.g. http://localhost:5173/
        pdf = await renderSummaryPdf(new URL('executive-summary/', base).href);
      } catch (err) {
        server.config.logger.warn(`[PDF] Could not make a fresh PDF (${err.message}). Run "npm install" once. Sending the saved file instead.`);
        try { pdf = await readFile(new URL(`.${PDF_PATH}`, import.meta.url)); }
        catch { res.statusCode = 404; res.end(); return; }
      }
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${PDF_NAME}"`);
      res.end(pdf);
    });
  }
};

export default {
  css: { devSourcemap: true },
  plugins: [summaryPdf]
};
