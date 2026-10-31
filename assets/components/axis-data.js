/* =========================================================
   AXIS DATA – builds parts of the axis pages from the JSON file
   data-render="tracking"  self-tracking progress cards
   data-render="cases"     case study cards
   data-render="pas"       PAS table (with data-objective="1")
   data-source="../assets/data/axis-1.json"
   ========================================================= */

import { initCarousel } from './carousel.js';

const ICONS = new URL('../../', import.meta.url).href + 'assets/img/icons/';
const cache = {};
const load = url => (cache[url] ||= fetch(url).then(r => r.json()));

/* --- Self-tracking card --- */
const trackingCard = c => `
  <article class="card-tracking card-tracking--${c.status}">
    <div class="card-tracking__header">
      <p class="card-tracking__category">${c.category}</p>
      <span class="card-tracking__status">${c.statusLabel}</span>
    </div>
    <div>
      <h4 class="card-tracking__name">${c.name}</h4>
      <p class="card-tracking__description">${c.description}</p>
    </div>
    <div class="card-tracking__indicator">
      <p class="card-tracking__label">Indicator</p>
      <p class="card-tracking__indicator-name">${c.indicator}</p>
    </div>
    <div class="card-tracking__progress">
      <div class="card-tracking__value-row">
        <span class="card-tracking__value">${c.value}</span>
        <span class="card-tracking__unit">${c.unit || ''}</span>
        <span class="card-tracking__reported">${c.reported}</span>
      </div>
      <div class="progress-bar" role="img" aria-label="${c.progress}% of the target">
        <span class="progress-bar__fill" style="width: ${c.progress}%"></span>
      </div>
      <div class="card-tracking__scale">
        <span>${c.baseline}</span>
        <strong>${c.target}</strong>
      </div>
    </div>
    <div>
      <p class="card-tracking__findings-title">Key findings and implications</p>
      <p class="card-tracking__findings">${c.findings}</p>
    </div>
  </article>`;

/* --- Case study card --- */
const caseCard = c => `
  <article class="card-case">
    <p class="card-case__eyebrow">Case study</p>
    <h4 class="card-case__title">${c.title}</h4>
    <p class="card-case__by">${c.initiative}</p>
    <div class="card-case__meta">
      ${c.target ? `<p class="card-case__target">${c.target}</p>` : ''}
      ${c.contribution ? `<p class="card-case__contribution">${c.contribution}</p>` : ''}
    </div>
    <div class="card-case__body prose">${c.body.map(p => `<p>${p}</p>`).join('')}</div>
    <!-- CHECK: link to the initiative on NAZCA -->
    <a class="link-arrow" href="${c.link || '#'}">View initiative on NAZCA <img class="link-arrow__icon" src="${ICONS}chevron-down.svg" alt=""></a>
  </article>`;

/* --- PAS table: No. | Plan to Accelerate Solutions (count) --- */
const pasTable = list => `
  <thead><tr>
    <th scope="col" class="pas-table__no">No.</th>
    <th scope="col">Plan to Accelerate Solutions (${list.length})</th>
  </tr></thead>
  <tbody>${list.map((name, i) => `
    <tr><td class="pas-table__no">${i + 1}</td><td>${name}</td></tr>`).join('')}
  </tbody>`;

async function render(el) {
  try {
    const data = await load(new URL(el.dataset.source, document.baseURI));
    const type = el.dataset.render;
    if (type === 'tracking') el.innerHTML = data.tracking.map(trackingCard).join('');
    if (type === 'cases')    el.innerHTML = data.cases.map(caseCard).join('');
    if (type === 'pas')      el.innerHTML = pasTable(data.pas[el.dataset.objective] || []);

    const carousel = el.closest('[data-carousel]');
    if (carousel) initCarousel(carousel);
  } catch (err) {
    console.error('Could not load axis data:', err);
  }
}

document.querySelectorAll('[data-render][data-source]').forEach(render);
