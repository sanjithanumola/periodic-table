// FIXED PERIODIC TABLE ALIGNMENT + BETTER CARD HANDLING

const cards = [...utils.$('#scene-content .element')];

// FIX MAIN TABLE ALIGNMENT
// -------------------------
// Move period 6 and 7 transition metals one column right
// to properly align after Lanthanides / Actinides placeholders

for (let i = 0; i < elements.length; i += ELEMENT_STRIDE) {

  const symbol = elements[i + ELEMENT_FIELDS.SYMBOL];
  const row = elements[i + ELEMENT_FIELDS.ROW];

  // Period 6 fixes
  if (
    row === 6 &&
    [
      'Hf','Ta','W','Re','Os','Ir','Pt','Au','Hg',
      'Tl','Pb','Bi','Po','At','Rn'
    ].includes(symbol)
  ) {
    elements[i + ELEMENT_FIELDS.COLUMN] += 1;
  }

  // Period 7 fixes
  if (
    row === 7 &&
    [
      'Rf','Db','Sg','Bh','Hs','Mt','Ds','Rg','Cn',
      'Nh','Fl','Mc','Lv','Ts','Og'
    ].includes(symbol)
  ) {
    elements[i + ELEMENT_FIELDS.COLUMN] += 1;
  }

  // Optional:
  // Move Lu and Lr to end of f-block
  if (symbol === 'Lu') {
    elements[i + ELEMENT_FIELDS.COLUMN] = 18;
  }

  if (symbol === 'Lr') {
    elements[i + ELEMENT_FIELDS.COLUMN] = 18;
  }
}

// -------------------------
// GENERATE TABLE HTML
// -------------------------

const [ $sceneContent ] = utils.$('#scene-content');
const [ $template ] = utils.$('#element');

for (let i = 0, l = elements.length / ELEMENT_STRIDE; i < l; i += 1) {

  const offset = i * ELEMENT_STRIDE;

  const $el = $template.content.cloneNode(true);
  const $element = $el.querySelector('.element');

  const $number = $element.querySelector('.element-number');
  const $symbol = $element.querySelector('.element-symbol');
  const $title = $element.querySelector('.element-title');
  const $description = $element.querySelector('.element-description');

  $number.textContent = i + 1;

  $symbol.textContent =
    elements[offset + ELEMENT_FIELDS.SYMBOL];

  $title.textContent =
    elements[offset + ELEMENT_FIELDS.NAME];

  $element.dataset.color =
    elements[offset + ELEMENT_FIELDS.COLOR];

  $element.style.gridColumn =
    elements[offset + ELEMENT_FIELDS.COLUMN];

  $element.style.gridRow =
    elements[offset + ELEMENT_FIELDS.ROW];

  $description.innerHTML = [
    `Atomic mass: ${elements[offset + ELEMENT_FIELDS.ATOMIC_MASS]} u`,
    `Density: ${elements[offset + ELEMENT_FIELDS.DENSITY]} g/cm3`,
    `Melting: ${elements[offset + ELEMENT_FIELDS.MELTING_POINT]} °C`,
    `Boiling: ${elements[offset + ELEMENT_FIELDS.BOILING_POINT]} °C`,
  ].join('<br>');

  $sceneContent.appendChild($el);
}

// -------------------------
// BETTER RANDOM LAYOUT
// -------------------------

transformLayout.random = () => {

  pointer.rotateX = 15;
  pointer.rotateY = 20;

  utils.set(cards, {
    x: () => utils.random(-800, 800),
    y: () => utils.random(-800, 800),
    z: () => utils.random(-1200, 1200),
    rotateX: () => utils.random(-360, 360),
    rotateY: () => utils.random(-360, 360),
    opacity: () => utils.random(.4, 1),
  });
};

// -------------------------
// BETTER CARD GLOW EFFECT
// -------------------------

cards.forEach(card => {

  card.addEventListener('mouseenter', () => {

    card.style.transform += ' scale(1.08)';

    card.style.boxShadow = `
      0 0 12px rgba(0,255,255,.4),
      0 0 25px rgba(0,255,255,.3),
      0 0 50px rgba(0,255,255,.2)
    `;

  });

  card.addEventListener('mouseleave', () => {

    card.style.boxShadow = '';
  });
});

// -------------------------
// INTRO ANIMATION
// -------------------------

transformLayout.random();

utils.set(cards, {
  opacity: 0
});

elementsLayout.update(
  () => transformLayout.table(),
  {
    delay: stagger([0, 1000], {
      from: 'random'
    })
  }
);
