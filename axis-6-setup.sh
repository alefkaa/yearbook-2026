#!/bin/bash
# Axis 6 setup – two small style additions:
#   1. objective tabs that wrap onto two rows (Axis 6 has 11 objectives)
#   2. hide the grey info box on a case study card when it has nothing in it
# Run once from the project folder:  bash axis-6-setup.sh   (Axis 4 setup must have been run before)
set -e
C=assets/components
if grep -q "AXIS6-ADDED" $C/tabs.css; then echo "Already added – nothing to do"; exit 0; fi

cat >> $C/tabs.css <<'CSS'

/* AXIS6-ADDED */
/* ---------------------------------------------------------
   GRID OBJECTIVE TABS (many objectives, e.g. Axis 6)
   Tabs wrap onto rows: tabs--cols-6 = 6 per row, tabs--cols-5 = 5 per row
   --------------------------------------------------------- */
.tabs--grid .tabs__list {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  margin-left: -1px;               /* hides the left line of the first tab in every row */
}
.tabs--grid.tabs--cols-5 .tabs__list { grid-template-columns: repeat(5, minmax(0, 1fr)); }
.tabs--grid .tabs__tab:first-child { border-left: 1px solid var(--color-border-default); }

@media (max-width: 900px) {
  .tabs--grid .tabs__list { display: flex; margin-left: 0; }
  .tabs--grid .tabs__tab:first-child { border-left: 0; }
}
CSS

cat >> $C/cards.css <<'CSS'

/* AXIS6-ADDED */
/* Case study card: no grey box when there is no target / contribution text */
.card-case__meta:not(:has(*)) { display: none; }
CSS
echo "Axis 6 styles added"
