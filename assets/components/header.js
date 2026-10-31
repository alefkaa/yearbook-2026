/* =========================================================
   PAGE HEADER
   <yb-header heading="Introduction"></yb-header>

   Options:
   image="my-photo.png"     other photo (from assets/img/)
   eyebrow="Axis 1"         other small text above the title
   size="large"             bigger eyebrow (axis pages)
   heading="Line 1|Line 2"  "|" = line break in the title
   ========================================================= */

const ROOT = new URL('../../', import.meta.url).href;
const IMG  = ROOT + 'assets/img/';

class YbHeader extends HTMLElement {
  connectedCallback() {
    const heading = (this.getAttribute('heading') || '').split('|').join('<br>');
    const image   = this.getAttribute('image') || 'header-yearbook.png';
    const eyebrow = this.getAttribute('eyebrow') || 'Yearbook of Global Climate Action 2026';
    const large   = this.getAttribute('size') === 'large';

    this.innerHTML = `
      <header class="page-header${large ? ' page-header--large' : ''}">
        <img class="page-header__bg" src="${IMG}${image}" alt="">
        <div class="container page-header__content">
          <p class="page-header__eyebrow t-eyebrow-hero">${eyebrow}</p>
          <h1 class="t-display">${heading}</h1>
        </div>
      </header>`;
  }
}
customElements.define('yb-header', YbHeader);
