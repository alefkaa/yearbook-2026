/* =========================================================
   FOOTER
   <yb-footer></yb-footer>
   ========================================================= */

const ROOT  = new URL('../../', import.meta.url).href;
const ICONS = ROOT + 'assets/img/icons/';

// Social links: [name, icon file]  – CHECK: real URLs to come from UNFCCC
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
customElements.define('yb-footer', YbFooter);
