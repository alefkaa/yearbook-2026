/* =========================================================
   SIDEBAR – "On this page" navigation, builds itself from the page:
   every element with data-sidebar-label="…" (and optionally
   data-sidebar-number="I") gets a line.

   Desktop (1360px and wider): slim column of lines on the left.
     Hover or keyboard focus opens it to show all section names.
   Smaller screens: a bar under the navbar shows only the current
     section (purple line + name); tap it to open the full list.
   (Figma: Component page › Sidebar › sidebar / sidebar-mobile)
   ========================================================= */

const LIST_ICON = '<svg class="sidebar__icon" viewBox="0 0 26 20" aria-hidden="true"><path d="M8 5h15M8 10h15M8 15h15"/><circle cx="2.5" cy="5" r="1.25"/><circle cx="2.5" cy="10" r="1.25"/><circle cx="2.5" cy="15" r="1.25"/></svg>';
const CHEVRON   = '<svg class="sidebar-bar__chevron" viewBox="0 0 20 20" aria-hidden="true"><path d="M5 7.5l5 5 5-5"/></svg>';

let sidebarCount = 0;

class YbSidebar extends HTMLElement {
  connectedCallback() {
    const sections = Array.from(document.querySelectorAll('[data-sidebar-label][id]'));
    if (!sections.length) return;

    const text = s => {
      const num = s.dataset.sidebarNumber;
      return `${num ? `<span class="sidebar__number">${num}</span>` : ''}<span class="sidebar__name">${s.dataset.sidebarLabel}</span>`;
    };
    const list = sections.map(s => `
      <li><a class="sidebar__link" href="#${s.id}">
        <span class="sidebar__line" aria-hidden="true"></span>
        <span class="sidebar__text">${text(s)}</span>
      </a></li>`).join('');
    const panelId = `yb-sidebar-list-${++sidebarCount}`;

    this.innerHTML = `
      <nav class="sidebar" aria-label="On this page">
        <div class="sidebar__header">${LIST_ICON}<span class="sidebar__title t-eyebrow-card">ON THIS PAGE</span></div>
        <ul class="sidebar__list">${list}</ul>
      </nav>

      <nav class="sidebar-bar" aria-label="On this page">
        <button type="button" class="sidebar-bar__toggle" aria-expanded="false" aria-controls="${panelId}">
          <span class="sidebar-bar__row">
            <span class="sidebar__line" aria-hidden="true"></span>
            <span class="sidebar-bar__current"></span>
          </span>
          ${CHEVRON}
        </button>
        <div class="sidebar-bar__panel" id="${panelId}" hidden>
          <ul class="sidebar__list">${list}</ul>
        </div>
      </nav>
      <div class="sidebar-bar__scrim" hidden></div>`;

    this.toggle  = this.querySelector('.sidebar-bar__toggle');
    this.panel   = this.querySelector('.sidebar-bar__panel');
    this.scrim   = this.querySelector('.sidebar-bar__scrim');
    this.current = this.querySelector('.sidebar-bar__current');
    const links  = Array.from(this.querySelectorAll('.sidebar__link'));

    // Current section: highlight it in both lists and show it in the mobile bar
    const setCurrent = id => {
      links.forEach(link => link.setAttribute('aria-current', link.hash === '#' + id));
      const s = sections.find(x => x.id === id);
      if (s) {
        this.current.innerHTML = text(s);
        this.toggle.setAttribute('aria-label', `On this page: ${s.dataset.sidebarNumber ? s.dataset.sidebarNumber + ' ' : ''}${s.dataset.sidebarLabel}. Show all sections`);
      }
    };
    setCurrent(sections[0].id);
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) setCurrent(entry.target.id); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(s => observer.observe(s));

    // Mobile bar: open / close
    this.toggle.addEventListener('click', () => this.setOpen(!this.isOpen));
    this.scrim.addEventListener('click', () => this.setOpen(false));
    this.panel.addEventListener('click', e => { if (e.target.closest('a')) this.setOpen(false); });
    this.addEventListener('keydown', e => { if (e.key === 'Escape' && this.isOpen) { this.setOpen(false); this.toggle.focus(); } });

    // Keep the bar just under the navbar (its height changes between desktop and mobile)
    const navbar = document.querySelector('yb-navbar');
    if (navbar) {
      const setOffset = () => document.documentElement.style.setProperty('--sidebar-top', navbar.offsetHeight + 'px');
      new ResizeObserver(setOffset).observe(navbar);
      setOffset();
    }

    // Hide the sidebar while the big page header is on screen
    const header = document.querySelector('yb-header');
    if (header) {
      new IntersectionObserver(([entry]) => {
        this.classList.toggle('is-hidden', entry.isIntersecting);
        if (entry.isIntersecting) this.setOpen(false);
      }, { rootMargin: '-160px 0px 0px 0px' }).observe(header);
    }
  }

  get isOpen() { return this.classList.contains('is-open'); }

  setOpen(open) {
    this.classList.toggle('is-open', open);
    this.panel.hidden = !open;
    this.scrim.hidden = !open;
    this.toggle.setAttribute('aria-expanded', String(open));
  }
}
customElements.define('yb-sidebar', YbSidebar);
