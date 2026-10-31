/* =========================================================
   GSI TABLE – fills <table class="gsi-table"> from a JSON file
   <table class="gsi-table"
          data-gsi-source="../assets/data/axis-1.json"
          data-objective="1"></table>
   JSON: { "gsi": { "1": [ { indicator, trend, baseline{value,year,source}, latest{…} } ] } }
   ========================================================= */

const ROOT  = new URL('../../', import.meta.url).href;   // site root, same as navbar.js
const ICONS = ROOT + 'assets/img/icons/';

const TRENDS = {
  'progress':          { label: 'Progress',          icon: 'trend-progress.svg' },
  'no-progress':       { label: 'No Progress',       icon: 'trend-no-progress.svg' },
  'insufficient-data': { label: 'Insufficient Data', icon: 'trend-insufficient-data.svg' }
};

const cache = {};   // each JSON file is loaded once, even with several tables
function loadJson(url) {
  if (!cache[url]) cache[url] = fetch(url).then(r => r.json());
  return cache[url];
}

function valueCell(v) {
  return `
    <div class="gsi-value">
      <span class="gsi-value__number">${v.value}</span>
      ${v.year ? `<span class="gsi-value__year">${v.year}</span>` : ''}
      ${v.source ? `<span class="gsi-value__source">${v.source}</span>` : ''}
    </div>`;
}

function trendCell(key) {
  const t = TRENDS[key] || { label: key, icon: '' };
  return `
    <div class="trend trend--${key}">
      ${t.icon ? `<img src="${ICONS}${t.icon}" alt="">` : ''}
      <span>${t.label}</span>
    </div>`;
}

async function buildTable(table) {
  try {
    const data = await loadJson(new URL(table.dataset.gsiSource, document.baseURI));
    const rows = data.gsi[table.dataset.objective] || [];
    table.innerHTML = `
      <thead>
        <tr>
          <th scope="col">Indicator</th>
          <th scope="col">Trend</th>
          <th scope="col">Baseline</th>
          <th scope="col">Latest data available</th>
        </tr>
      </thead>
      <tbody>
        ${rows.map(r => `
          <tr>
            <td>${r.indicator}</td>
            <td class="gsi-table__trend">${trendCell(r.trend)}</td>
            <td class="gsi-table__value">${valueCell(r.baseline)}</td>
            <td class="gsi-table__latest">${valueCell(r.latest)}</td>
          </tr>`).join('')}
      </tbody>`;
  } catch (err) {
    console.error('Could not load the GSI table:', err);
  }
}

document.querySelectorAll('.gsi-table[data-gsi-source]').forEach(buildTable);
