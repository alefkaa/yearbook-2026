/* =========================================================
   ACCORDION + CCI LIST
   1. Accordion: any element with data-accordion
   2. CCI list: rows built from assets/data/ccis.json,
      with search, axis filters and show all / show fewer
   ========================================================= */

const ROOT = new URL('../../', import.meta.url).href;

/* ---------------------------------------------------------
   1. ACCORDION
   --------------------------------------------------------- */
function initAccordion(acc) {
  const btn = acc.querySelector('.accordion__header');
  const panel = acc.querySelector('.accordion__panel');

  function set(open) {
    acc.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', open);
    panel.inert = !open;            // hidden content can't be tabbed into
  }

  set(btn.getAttribute('aria-expanded') === 'true');
  btn.addEventListener('click', () => set(btn.getAttribute('aria-expanded') !== 'true'));
}

/* ---------------------------------------------------------
   2. CCI LIST
   --------------------------------------------------------- */

// Build one row from a JSON entry: { name, axes: [1, 6], logo }
function buildRow(cci) {
  const li = document.createElement('li');
  li.className = 'cci-row';
  li.dataset.axes = cci.axes.length ? cci.axes.join(' ') : 'none';

  const logo = document.createElement('img');
  logo.className = 'cci-row__logo';
  logo.src = ROOT + 'assets/img/logos/' + cci.logo;
  logo.alt = '';
  logo.loading = 'lazy';

  const text = document.createElement('div');
  text.className = 'cci-row__text';

  const name = document.createElement('p');
  name.className = 'cci-row__name';
  name.textContent = cci.name;

  const tags = document.createElement('div');
  tags.className = 'cci-row__tags';
  if (cci.axes.length) {
    cci.axes.forEach(n => {
      const tag = document.createElement('span');
      tag.className = 'tag tag--green';
      tag.textContent = 'Axis ' + n;
      tags.append(tag);
    });
  } else {
    const tag = document.createElement('span');
    tag.className = 'tag tag--neutral';
    tag.textContent = 'No axis specified';
    tags.append(tag);
  }

  text.append(name, tags);
  li.append(logo, text);
  return li;
}

async function initCciList(root) {
  const list = root.querySelector('.cci-list');

  // Load the rows from the JSON file
  if (list.dataset.cciSource) {
    try {
      const response = await fetch(new URL(list.dataset.cciSource, document.baseURI));
      const ccis = await response.json();
      ccis.forEach(cci => list.append(buildRow(cci)));
    } catch (err) {
      console.error('Could not load the CCI list:', err);
    }
  }

  const search = root.querySelector('[data-cci-search]');
  const chips  = Array.from(root.querySelectorAll('[data-cci-filter]'));
  const rows   = Array.from(list.querySelectorAll('.cci-row'));
  const more   = root.querySelector('[data-cci-more]');
  const empty  = root.querySelector('[data-cci-empty]');
  const label  = more.querySelector('span');
  const limit  = Number(root.dataset.limit) || 12;

  // Write the real number of CCIs everywhere it is shown (data-cci-count)
  document.querySelectorAll('[data-cci-count]').forEach(el => { el.textContent = rows.length; });
  const showAllText = `Show all ${rows.length} initiatives`;

  let axis = 'all';
  let expanded = false;

  function update() {
    const query = search.value.trim().toLowerCase();
    const filtering = query !== '' || axis !== 'all';
    let matches = 0;

    rows.forEach(row => {
      const name = row.querySelector('.cci-row__name').textContent.toLowerCase();
      const axes = (row.dataset.axes || '').split(' ');
      const isMatch = name.includes(query) && (axis === 'all' || axes.includes(axis));
      const allowed = filtering || expanded || matches < limit;   // first "limit" rows only, unless expanded or filtering
      row.hidden = !(isMatch && allowed);
      if (isMatch) matches++;
    });

    empty.hidden = matches > 0;
    more.hidden = filtering || rows.length <= limit;
    more.setAttribute('aria-expanded', expanded);
    label.textContent = expanded ? 'Show fewer initiatives' : showAllText;
  }

  search.addEventListener('input', update);

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      axis = chip.dataset.cciFilter;
      chips.forEach(c => c.setAttribute('aria-pressed', c === chip));
      update();
    });
  });

  more.addEventListener('click', () => {
    expanded = !expanded;
    update();
    if (!expanded) root.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  update();
}

document.querySelectorAll('[data-accordion]').forEach(initAccordion);
document.querySelectorAll('[data-cci-list]').forEach(initCciList);
