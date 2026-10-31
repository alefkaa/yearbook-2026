/* =========================================================
   INTERACTIVE COMPONENTS
   ========================================================= */
(function () {

  // Root of the site, worked out from where this file lives (assets/components/)
  const ROOT = new URL('../../', document.currentScript.src).href;

  /* --- TABS: any element with data-tabs --- */
  function initTabs(root) {
    const tabs = Array.from(root.querySelectorAll('[role="tab"]'));

    function select(tab, moveFocus) {
      tabs.forEach(t => {
        const on = t === tab;
        t.setAttribute('aria-selected', on);
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
      });
      if (moveFocus) tab.focus();
    }

    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => select(tab));
      tab.addEventListener('keydown', e => {
        let next;
        if (e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
        if (e.key === 'ArrowLeft')  next = tabs[(i - 1 + tabs.length) % tabs.length];
        if (e.key === 'Home') next = tabs[0];
        if (e.key === 'End')  next = tabs[tabs.length - 1];
        if (next) { e.preventDefault(); select(next, true); }
      });
    });

    select(tabs.find(t => t.getAttribute('aria-selected') === 'true') || tabs[0]);
  }

  /* --- ACCORDION: any element with data-accordion --- */
  function initAccordion(acc) {
    const btn = acc.querySelector('.accordion__header');
    const panel = acc.querySelector('.accordion__panel');

    function set(open) {
      acc.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', open);
      panel.inert = !open;
    }

    set(btn.getAttribute('aria-expanded') === 'true');
    btn.addEventListener('click', () => set(btn.getAttribute('aria-expanded') !== 'true'));
  }

  /* --- CCI LIST: build rows from JSON --- */
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

  /* --- CCI LIST: search + axis chips + show all / show fewer --- */
  async function initCciList(root) {
    const list = root.querySelector('.cci-list');

    // load the rows from the JSON file
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
    // write the real number of CCIs everywhere it is shown
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
        const allowed = filtering || expanded || matches < limit;
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

  document.querySelectorAll('[data-tabs]').forEach(initTabs);
  document.querySelectorAll('[data-accordion]').forEach(initAccordion);
  document.querySelectorAll('[data-cci-list]').forEach(initCciList);

})();