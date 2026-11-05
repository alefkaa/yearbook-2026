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
| `base.css` | Fonts, Figma variables (colours, sizes, spacing, radius, borders), reset, text styles (`.t-…`, one class per Figma text style), layout (`.container`, `.section`, `.grid-…`), motion. **Use these variables in every component – no typed-in colours, spacing, radius or font sizes.** |
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
| `components/print.css` | Print / Save as PDF: A4 pages, hides navbar & footer, keeps cards whole |

## Scripts

| File | What it does |
|---|---|
| `main.js` | Loads all the scripts below |
| `components/navbar.js` | `<yb-navbar active="…">` – navbar links + sticky behaviour. Below 1240px: logo + hamburger button that opens a full-screen menu (all links + download button) |
| `components/header.js` | `<yb-header heading="…">` – page header |
| `components/footer.js` | `<yb-footer>` – footer |
| `components/tabs.js` | Any `data-tabs` block |
| `components/accordion.js` | Any `data-accordion` block + the CCI list (search, filters, show all) |
| `components/sidebar.js` | `<yb-sidebar>` – "On this page" navigation built from `data-sidebar-label` (+ optional `data-sidebar-number`). Desktop 1360px+: slim column that opens on hover/focus. Smaller screens: bar under the navbar showing the current section, tap to open the list |
| `../scripts/summary-pdf.js` | Makes the Executive Summary PDF for the purple navbar button (fresh on every click with `npm run dev`; `npm run pdf` saves it to `executive-summary/`) |
| `../scripts/upload.js` | `npm run upload`: fresh PDF + clean copy of the site in `../yearbook-2026-upload/` – the folder to send to the server |

## Content & media

| Folder | What's inside |
|---|---|
| `data/ccis.json` | The CCI list: `{ "name", "axes": [1, 6], "logo" }` – empty `axes` = "No axis specified" |
| `fonts/` | Self-hosted fonts (.woff): Lora 400/600, Merriweather Sans 400/700 + italics, Roboto 500 – loaded by `base.css` |
| `img/` | Shared photos (home hero, Yearbook / Introduction header) |
| `img/executive-summary/` | Executive Summary header photo and the GCAA objectives image |
| `img/axis-1/` … `img/axis-6/` | Everything for one axis: page header photo, homepage card photo, COP 31 photo and the two NAZCA charts |
| `img/favicon/` | Favicon – same UNFCCC emblem as unfccc.int/resource/bigpicture: `favicon.ico` and `favicon.png`, both linked in the `<head>` of every page. Source in Figma: Component page › Favicon |
| `img/icons/` | All SVG icons (axes, objectives, priorities, UI) |
| `img/logos/` | CCI logos |
| `img/people/` | Portraits for the high-level messages (Introduction): `simon-stiell.jpg`, `dan-ioschpe.jpg`, `samed-agirbas.jpg` – 224×224 square crops (CSS makes them round) |
| `img/charts/` | Introduction charts exported from Figma as SVG (axis charts are in the axis folders) |

Lines marked `<!-- CHECK: … -->` in the pages are content still to confirm with the content team.
