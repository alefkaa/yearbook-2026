/* =========================================================
   NAVBAR
   <yb-navbar active="introduction"></yb-navbar>
   Homepage: <yb-navbar variant="transparent"></yb-navbar>
   ========================================================= */

const ROOT  = new URL('../../', import.meta.url).href;   // site root, wherever it is hosted
const ICONS = ROOT + 'assets/img/icons/';

// Navbar links: [folder name, label]
const PAGES = [
  ['home', 'Home'],
  ['introduction', 'Introduction'],
  ['executive-summary', 'Executive Summary'],
  ['axis-1', '1. Transitioning Energy, Industry, and Transport'],
  ['axis-2', '2. Stewarding Forests, Oceans and Biodiversity'],
  ['axis-3', '3. Transforming Agriculture and Food Systems'],
  ['axis-4', '4. Building Resilience for Cities, Infrastructure and Water'],
  ['axis-5', '5. Fostering Human and Social Development'],
  ['axis-6', '6. Unleashing Enablers and Accelerators, including on Finance, Technology and Capacity Building']
];

class YbNavbar extends HTMLElement {
  connectedCallback() {
    const active = this.getAttribute('active');
    const links = PAGES.map(([page, label]) => {
    const href = page === 'home' ? ROOT : `${ROOT}${page}/`;   // Home = site root
    const current = page === active ? ' aria-current="page"' : '';
      return `<li><a class="navbar__link t-nav" href="${href}"${current}>${label}</a></li>`;
    }).join('');

    this.innerHTML = `
      <nav class="navbar" aria-label="Yearbook">
        <div class="container navbar__inner">
          <div class="navbar__top">
            <a href="https://unfccc.int">
              <img src="${ICONS}logo-unfccc.svg" width="180" height="40" alt="United Nations Climate Change">
            </a>
            <a href="${ROOT}executive-summary/?print" class="btn btn--primary" data-print-summary>
              <img src="${ICONS}download.svg" width="24" height="24" alt="">
              Download the Executive Summary
            </a>
          </div>
          <ul class="navbar__links">${links}</ul>
        </div>
      </nav>`;
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
