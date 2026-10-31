/* =========================================================
   PRINT / SAVE AS PDF
   The navbar button "Download the Executive Summary" links to
   executive-summary/?print
   - On the Executive Summary page: opens the print dialog
   - On any other page: goes to the Executive Summary, which
     then opens the print dialog by itself
   In the dialog, choose "Save as PDF".
   ========================================================= */

const onSummary = /\/executive-summary\/(index\.html)?$/.test(location.pathname);

async function printPage() {
  await document.fonts.ready;          // wait for the web fonts
  window.print();
}

// Click on the button while already on the Executive Summary
document.addEventListener('click', e => {
  if (onSummary && e.target.closest('[data-print-summary]')) {
    e.preventDefault();
    printPage();
  }
});

// Arrived from another page with ?print → print once everything (images too) has loaded
if (onSummary && new URLSearchParams(location.search).has('print')) {
  history.replaceState(null, '', location.pathname);   // remove ?print from the address
  if (document.readyState === 'complete') printPage();
  else window.addEventListener('load', printPage, { once: true });
}
