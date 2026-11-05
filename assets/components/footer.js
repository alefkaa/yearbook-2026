/* =========================================================
   FOOTER
   <yb-footer></yb-footer>
   ========================================================= */

const ROOT  = new URL('../../', import.meta.url).href;
const ICONS = ROOT + 'assets/img/icons/';

// Social links: [name, icon file, url]  (same URLs as the UNFCCC site footer)
const SOCIAL = [
  ['X', 'social-x.svg', 'https://twitter.com/unfccc'],
  ['Facebook', 'social-facebook.svg', 'https://www.facebook.com/UNclimatechange'],
  ['LinkedIn', 'social-linkedin.svg', 'https://www.linkedin.com/company/unfccc'],
  ['Instagram', 'social-instagram.svg', 'https://www.instagram.com/unclimatechange'],
  ['Flickr', 'social-flickr.svg', 'https://www.flickr.com/photos/unfccc/'],
  ['YouTube', 'social-youtube.svg', 'https://www.youtube.com/user/climateconference']
];

// "This site" links: [label, url]  (same URLs as the UNFCCC site footer)
const UNFCCC = 'https://unfccc.int';
const SITE_LINKS = [
  [['Code of conduct', UNFCCC + '/about-us/code-of-conduct-for-unfccc-conferences-meetings-and-events'],
   ['Terms of use', UNFCCC + '/this-site/terms-of-use'],
   ['Calendar disclaimer', UNFCCC + '/this-site/calendar-disclaimer']],
  [['Fraud alert', UNFCCC + '/this-site/fraud-alert'],
   ['Contact', UNFCCC + '/about-us/contact-and-directions/find-contact-by-issue'],
   ['Vacancies', UNFCCC + '/secretariat/employment/index.html']]
];

const link = (label, url) => `<li><a href="${url}" target="_blank" rel="noopener">${label}</a></li>`;

class YbFooter extends HTMLElement {
  connectedCallback() {
    const social = SOCIAL.map(([name, icon, url]) =>
      `<li><a href="${url}" target="_blank" rel="noopener" aria-label="${name}"><img src="${ICONS}${icon}" width="16" height="16" alt=""></a></li>`
    ).join('');

    this.innerHTML = `
      <footer class="footer">
        <div>
          <p class="footer__title">THIS SITE</p>
          <div class="footer__columns">
            ${SITE_LINKS.map(col => `<ul>${col.map(([l, u]) => link(l, u)).join('')}</ul>`).join('')}
          </div>
        </div>
        <ul class="footer__social">${social}</ul>
      </footer>`;
  }
}
customElements.define('yb-footer', YbFooter);
