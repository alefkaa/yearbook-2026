# Yearbook of Global Climate Action 2026 – where things are

Every page loads just two files:

```html
<link rel="stylesheet" href="../assets/main.css">
<script type="module" src="../assets/main.js"></script>
```
(on the homepage, without `../`)

## Styles

| File | What's inside |
|---|---|
| `main.css` | Loads all the files below, in order. Add new files here. |
| `base.css` | Fonts, Figma variables (colours, sizes, spacing), reset, text styles (`.t-…`), layout (`.container`, `.section`, `.grid-…`), motion |
| `components/buttons.css` | Buttons (`.btn`) and tags (`.tag`) |
| `components/headings.css` | Section headings and sub-headings |
| `components/callouts.css` | Blue explainer boxes (`.callout`) |
| `components/cards.css` | Accent, snapshot, link, axis and key-objective cards, key numbers |
| `components/charts.css` | Chart boxes and chart notes |
| `components/navbar.css` | Sticky navbar (+ transparent homepage version) |
| `components/header.css` | Photo page header |
| `components/footer.css` | UNFCCC footer |
| `components/tabs.css` | Axis tabs |
| `components/accordion.css` | Accordion, search field, filter chips, CCI list |
| `pages/home.css` | Homepage only: hero, intro, axis grid |

## Scripts

| File | What it does |
|---|---|
| `main.js` | Loads all the scripts below |
| `components/navbar.js` | `<yb-navbar active="…">` – navbar links + sticky behaviour |
| `components/header.js` | `<yb-header heading="…">` – page header |
| `components/footer.js` | `<yb-footer>` – footer |
| `components/tabs.js` | Any `data-tabs` block |
| `components/accordion.js` | Any `data-accordion` block + the CCI list (search, filters, show all) |

## Content & media

| Folder | What's inside |
|---|---|
| `data/ccis.json` | The CCI list: `{ "name", "axes": [1, 6], "logo" }` – empty `axes` = "No axis specified" |
| `fonts/` | Lora, Merriweather Sans, Roboto (woff2) |
| `img/` | Photos (page headers, homepage) |
| `img/icons/` | All SVG icons (axes, objectives, priorities, UI) |
| `img/logos/` | CCI logos |
| `img/charts/` | Charts exported from Figma as SVG |

Lines marked `<!-- CHECK: … -->` in the pages are content still to confirm with the content team.
