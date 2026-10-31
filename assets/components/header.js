/* =========================================================
   PAGE HEADER
   <yb-header heading="Introduction"></yb-header>
   Optional other photo: <yb-header heading="…" image="my-photo.png">
   (photos live in assets/img/)
   ========================================================= */

const ROOT = new URL('../../', import.meta.url).href;
const IMG  = ROOT + 'assets/img/';

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
customElements.define('yb-header', YbHeader);
