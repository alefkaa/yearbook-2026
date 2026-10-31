/* =========================================================
   FRAME: Navbar, Header, Footer (same on every page)
   ========================================================= */
(function () {

  // Root of the site, worked out from where this file lives (assets/components/)
  const ROOT = new URL('../../', document.currentScript.src).href;
  const IMG = ROOT + 'assets/img/';
  const ICONS = IMG + 'icons/';

  /* --- NAVBAR:  <yb-navbar active="introduction"></yb-navbar> --- */
  const PAGES = [
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
      const links = PAGES.map(([page, label]) =>
        `<li><a class="navbar__link t-nav" href="${ROOT}${page}/"${page === active ? ' aria-current="page"' : ''}>${label}</a></li>`
      ).join('');

      this.innerHTML = `
                <nav class="navbar${this.getAttribute('variant') === 'transparent' ? ' navbar--transparent' : ''}" aria-label="Yearbook">
          <div class="container navbar__inner">
            <div class="navbar__top">
              <a href="https://unfccc.int">
                <img src="${ICONS}logo-unfccc.svg" width="180" height="40" alt="United Nations Climate Change">
              </a>
              <a href="#" class="btn btn--primary">
                <img src="${ICONS}download.svg" width="24" height="24" alt="">
                Download the Executive Summary
              </a>
            </div>
            <ul class="navbar__links">${links}</ul>
          </div>
        </nav>`;
    }
  }

  /* --- HEADER:  <yb-header heading="Introduction"></yb-header> --- */
  class YbHeader extends HTMLElement {
    connectedCallback() {
      const heading = this.getAttribute('heading') || '';
      const image = this.getAttribute('image') || 'header-yearbook.png';

      this.innerHTML = `
        <header class="page-header">
          <img class="page-header__bg" src="${IMG}${image}" alt="">
          <div class="container page-header__content">
            <p class="t-eyebrow-hero">Yearbook of Global Climate Action 2026</p>
            <h1 class="t-display">${heading}</h1>
          </div>
        </header>`;
    }
  }

  /* --- FOOTER:  <yb-footer></yb-footer> --- */
  const SOCIAL = [
    ['X', 'social-x.svg'],
    ['Facebook', 'social-facebook.svg'],
    ['LinkedIn', 'social-linkedin.svg'],
    ['Instagram', 'social-instagram.svg'],
    ['Flickr', 'social-flickr.svg'],
    ['YouTube', 'social-youtube.svg']
  ];

  class YbFooter extends HTMLElement {
    connectedCallback() {
      const social = SOCIAL.map(([name, icon]) =>
        `<li><a href="#" aria-label="${name}"><img src="${ICONS}${icon}" width="16" height="16" alt=""></a></li>`
      ).join('');

      this.innerHTML = `
        <footer class="footer">
          <div>
            <p class="footer__title">THIS SITE</p>
            <div class="footer__columns">
              <ul>
                <li><a href="#">Code of conduct</a></li>
                <li><a href="#">Terms of use</a></li>
                <li><a href="#">Calendar disclaimer</a></li>
              </ul>
              <ul>
                <li><a href="#">Fraud alert</a></li>
                <li><a href="#">Contact</a></li>
                <li><a href="#">Vacancies</a></li>
              </ul>
            </div>
          </div>
          <ul class="footer__social">${social}</ul>
        </footer>`;
    }
  }

  customElements.define('yb-navbar', YbNavbar);
  customElements.define('yb-header', YbHeader);
  customElements.define('yb-footer', YbFooter);

  
  /* --- STICKY NAVBAR: mark it once the page has scrolled --- */
  function onScroll() {
    document.querySelectorAll('yb-navbar').forEach(nav => {
      nav.classList.toggle('is-scrolled', window.scrollY > 10);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

})();