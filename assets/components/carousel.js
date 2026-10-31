/* =========================================================
   CAROUSEL – shows the cards of a track a few at a time
   <div class="carousel" data-carousel data-per-page="2">
     <div class="carousel__track"> …cards… </div>
   </div>
   Adds the "1–2 of 4" status, page numbers and ← → buttons.
   On small screens it always shows 1 card per page.
   ========================================================= */

const ICON = new URL('../../', import.meta.url).href + 'assets/img/icons/chevron-down.svg';

export function initCarousel(root) {
  if (root.dataset.ready) return;             // only once
  const track = root.querySelector('.carousel__track');
  const items = Array.from(track.children);
  if (!items.length) return;
  root.dataset.ready = 'true';

  const controls = document.createElement('div');
  controls.className = 'carousel__controls';
  controls.innerHTML = `
    <p class="carousel__status" aria-live="polite"></p>
    <div class="carousel__pager">
      <button class="carousel__arrow carousel__arrow--prev" type="button" aria-label="Previous"><img src="${ICON}" alt=""></button>
      <div class="carousel__pages"></div>
      <button class="carousel__arrow carousel__arrow--next" type="button" aria-label="Next"><img src="${ICON}" alt=""></button>
    </div>`;
  root.append(controls);

  const status = controls.querySelector('.carousel__status');
  const pagesBox = controls.querySelector('.carousel__pages');
  const prev = controls.querySelector('.carousel__arrow--prev');
  const next = controls.querySelector('.carousel__arrow--next');
  const small = window.matchMedia('(max-width: 900px)');
  let page = 0;

  const perPage = () => (small.matches ? 1 : Number(root.dataset.perPage) || 1);
  const pageCount = () => Math.ceil(items.length / perPage());

  function render() {
    const per = perPage();
    const count = pageCount();
    page = Math.min(page, count - 1);
    root.style.setProperty('--per-page', per);

    items.forEach((item, i) => {
      const visible = Math.floor(i / per) === page;
      item.hidden = !visible;
    });

    const first = page * per + 1;
    const last = Math.min(first + per - 1, items.length);
    status.textContent = `${first === last ? first : first + '–' + last} of ${items.length}`;

    pagesBox.innerHTML = '';
    for (let p = 0; p < count; p++) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'carousel__page';
      b.textContent = p + 1;
      b.setAttribute('aria-label', `Page ${p + 1}`);
      if (p === page) b.setAttribute('aria-current', 'true');
      b.addEventListener('click', () => { page = p; render(); });
      pagesBox.append(b);
    }
    prev.disabled = page === 0;
    next.disabled = page === count - 1;
    controls.hidden = count < 2;
  }

  prev.addEventListener('click', () => { page--; render(); });
  next.addEventListener('click', () => { page++; render(); });
  small.addEventListener('change', render);
  render();
}

// Carousels whose cards are already in the HTML
document.querySelectorAll('[data-carousel]').forEach(root => {
  if (root.querySelector('.carousel__track').children.length) initCarousel(root);
});
