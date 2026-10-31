/* =========================================================
   INTERACTIVE COMPONENTS
   ========================================================= */
(function () {

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

  document.querySelectorAll('[data-tabs]').forEach(initTabs);

})();