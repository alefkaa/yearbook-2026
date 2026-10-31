/* =========================================================
   SIDEBAR – builds itself from the page:
   every element with data-sidebar-label="…" gets a line.
   ========================================================= */

class YbSidebar extends HTMLElement {
  connectedCallback() {
    const sections = Array.from(document.querySelectorAll('[data-sidebar-label][id]'));
    if (!sections.length) return;

    this.innerHTML = `
      <nav aria-label="On this page">
        <ul class="sidebar">
          ${sections.map(s => `
            <li><a class="sidebar__link" href="#${s.id}">
              <span class="sidebar__label">${s.dataset.sidebarLabel}</span>
            </a></li>`).join('')}
        </ul>
      </nav>`;

    const links = Array.from(this.querySelectorAll('.sidebar__link'));

    // Highlight the section currently in the middle of the screen
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        links.forEach(link => link.setAttribute('aria-current', link.hash === '#' + entry.target.id));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(s => observer.observe(s));

    // Hide the sidebar while the big page header is on screen
    const header = document.querySelector('yb-header');
    if (header) {
      new IntersectionObserver(([entry]) => {
        this.classList.toggle('is-hidden', entry.isIntersecting);
      }, { rootMargin: '-160px 0px 0px 0px' }).observe(header);
    }
  }
}
customElements.define('yb-sidebar', YbSidebar);
