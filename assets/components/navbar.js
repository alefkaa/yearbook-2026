/* =========================================================
   NAVBAR
   <yb-navbar active="introduction"></yb-navbar>
   Homepage: <yb-navbar variant="transparent"></yb-navbar>

   Desktop (1240px and wider): logo, download button and all links.
   Smaller screens: logo + hamburger button. The button opens a
   full-screen menu with all links and the download button at the
   bottom (Figma: Navbar › Breakpoint=Mobile).
   ========================================================= */

const ROOT  = new URL('../../', import.meta.url).href;   // site root, wherever it is hosted
const ICONS = ROOT + 'assets/img/icons/';
// Executive Summary PDF (made by scripts/summary-pdf.js – same name there)
const PDF_NAME = 'Yearbook-of-Global-Climate-Action-2026-Executive-Summary.pdf';
const MOBILE = window.matchMedia('(max-width: 1239px)');

// Navbar links: [folder name, label]
const PAGES = [
  ['home', 'Home'],
  ['executive-summary', 'Executive Summary'],
  ['introduction', 'Introduction'],
  ['axis-1', '1. Transitioning Energy, Industry, and Transport'],
  ['axis-2', '2. Stewarding Forests, Oceans and Biodiversity'],
  ['axis-3', '3. Transforming Agriculture and Food Systems'],
  ['axis-4', '4. Building Resilience for Cities, Infrastructure and Water'],
  ['axis-5', '5. Fostering Human and Social Development'],
  ['axis-6', '6. Unleashing Enablers and Accelerators, including on Finance, Technology and Capacity Building']
];

// Icons drawn with currentColor so CSS controls their colour
const ICON_MENU  = '<svg class="navbar__toggle-icon navbar__toggle-icon--menu" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';
const ICON_CLOSE = '<svg class="navbar__toggle-icon navbar__toggle-icon--close" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';

let menuCount = 0;

class YbNavbar extends HTMLElement {
  connectedCallback() {
    const active = this.getAttribute('active');
    const menuId = `yb-menu-${++menuCount}`;

    const linkItems = (cls) => PAGES.map(([page, label]) => {
      const href = page === 'home' ? ROOT : `${ROOT}${page}/`;   // Home = site root
      const current = page === active ? ' aria-current="page"' : '';
      return `<li class="${cls}__item"><a class="navbar__link t-nav" href="${href}"${current}>${label}</a></li>`;
    }).join('');

    const downloadBtn = (extra = '') => `
      <a href="${ROOT}executive-summary/${PDF_NAME}" download="${PDF_NAME}" class="btn btn--primary ${extra}">
        <img src="${ICONS}download.svg" width="24" height="24" alt="">
        Download the Executive Summary
      </a>`;

    this.innerHTML = `
      <nav class="navbar" aria-label="Yearbook">
        <div class="container navbar__inner">
          <div class="navbar__top">
            <a class="navbar__logo" href="https://unfccc.int">
              <img src="${ICONS}logo-unfccc.svg" width="180" height="40" alt="United Nations Climate Change">
            </a>
            ${downloadBtn('btn--medium navbar__download')}
            <button type="button" class="navbar__toggle" aria-expanded="false" aria-controls="${menuId}" aria-label="Open menu">
              ${ICON_MENU}${ICON_CLOSE}
            </button>
          </div>
          <ul class="navbar__links">${linkItems('navbar__links')}</ul>
        </div>

        <div class="navbar__menu" id="${menuId}" hidden>
          <ul class="navbar__menu-links">${linkItems('navbar__menu-links')}</ul>
          <div class="navbar__menu-footer">${downloadBtn('navbar__menu-download')}</div>
        </div>
      </nav>`;

    this.toggle = this.querySelector('.navbar__toggle');
    this.menu = this.querySelector('.navbar__menu');

    this.toggle.addEventListener('click', () => this.setOpen(!this.isOpen));
    this.menu.addEventListener('click', e => { if (e.target.closest('a')) this.setOpen(false); });
    this.addEventListener('keydown', e => { if (e.key === 'Escape' && this.isOpen) { this.setOpen(false); this.toggle.focus(); } });
    MOBILE.addEventListener('change', e => { if (!e.matches) this.setOpen(false); });   // back to desktop → close
  }

  get isOpen() { return this.classList.contains('is-open'); }

  setOpen(open) {
    this.classList.toggle('is-open', open);
    this.menu.hidden = !open;
    this.toggle.setAttribute('aria-expanded', String(open));
    this.toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.documentElement.classList.toggle('has-open-menu', open);   // stops the page scrolling behind
    if (open) this.menu.querySelector('a')?.focus();
  }
}
customElements.define('yb-navbar', YbNavbar);

// Sticky navbar: mark it once the page has scrolled (adds the shadow,
// and turns the homepage's transparent navbar white)
function onScroll() {
  document.querySelectorAll('yb-navbar').forEach(nav => {
    nav.classList.toggle('is-scrolled', window.scrollY > 10);
  });
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();
