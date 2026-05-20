// ==========================================
// SUPER SMOOTH CINEMATIC PERIODIC TABLE
// ==========================================

import {
  createLayout,
  utils,
  stagger,
  spring,
  createTimer,
  createAnimatable,
  animate
} from 'https://esm.sh/animejs@4.3.0';

// ==========================================
// FIXED CARDS ARRAY
// ==========================================

const cards = [...utils.$('#scene-content .element')];

// ==========================================
// SCENE CAMERA
// ==========================================

const sceneAnimatable = createAnimatable('#scene', {
  rotateX: 200,
  rotateY: 200,
  scale: 1
});

const pointer = {
  x: 0,
  y: 0,
  rotateX: 15,
  rotateY: 20,
  rx: 0,
  ry: 0,
};

// ==========================================
// ULTRA SMOOTH CAMERA MOVEMENT
// ==========================================

createTimer({
  onUpdate: () => {

    pointer.rx = utils.lerp(pointer.rx, pointer.rotateX, 0.03);
    pointer.ry = utils.lerp(pointer.ry, pointer.rotateY, 0.03);

    sceneAnimatable.rotateX(pointer.y * pointer.rx);
    sceneAnimatable.rotateY(pointer.x * pointer.ry);

  }
});

// ==========================================
// POINTER PARALLAX
// ==========================================

document.addEventListener('pointermove', event => {

  const hw = window.innerWidth * 0.5;
  const hh = window.innerHeight * 0.5;

  pointer.x = utils.mapRange(
    event.clientX - hw,
    -hw,
    hw,
    1,
    -1
  );

  pointer.y = utils.mapRange(
    event.clientY - hh,
    -hh,
    hh,
    -1,
    1
  );

});

// ==========================================
// LAYOUT ENGINE
// ==========================================

const [ $sceneContent ] = utils.$('#scene-content');

const elementsLayout = createLayout($sceneContent, {
  properties: ['font-size'],
  duration: 2200,
  ease: 'inOutExpo',
});

// ==========================================
// ADVANCED LAYOUTS
// ==========================================

const transformLayout = {

  // ======================================
  // TABLE
  // ======================================

  table: () => {

    pointer.rotateX = 15;
    pointer.rotateY = 20;

    cards.forEach(($el, i) => {

      const expanded =
        $el.classList.contains('is-expanded');

      $el.style.opacity = 1;

      $el.style.transform =
        expanded
          ? `translateZ(80px) scale(1.15)`
          : `translateZ(10px)`;

    });

  },

  // ======================================
  // SPHERE
  // ======================================

  sphere: () => {

    pointer.rotateX = 50;
    pointer.rotateY = 360;

    const radius = 420;

    cards.forEach(($el, i) => {

      const phi =
        Math.acos(-1 + (2 * i) / cards.length);

      const theta =
        Math.sqrt(cards.length * Math.PI) * phi;

      const x =
        radius * Math.cos(theta) * Math.sin(phi);

      const y =
        radius * Math.sin(theta) * Math.sin(phi);

      const z =
        radius * Math.cos(phi);

      const yaw = Math.atan2(x, z);

      const pitch =
        -Math.atan2(y, Math.hypot(x, z));

      $el.style.transform = `
        translate3d(${x}px, ${y}px, ${z}px)
        rotateY(${yaw}rad)
        rotateX(${pitch}rad)
      `;

    });

  },

  // ======================================
  // HELIX
  // ======================================

  helix: () => {

    pointer.rotateX = 30;
    pointer.rotateY = 280;

    const radius = 420;

    cards.forEach(($el, i) => {

      const theta = i * 0.35;

      const x = radius * Math.sin(theta);
      const z = radius * Math.cos(theta);
      const y = (i - cards.length / 2) * 10;

      const yaw = Math.atan2(x, z);

      $el.style.transform = `
        translate3d(${x}px, ${y}px, ${z}px)
        rotateY(${yaw}rad)
      `;

    });

  },

  // ======================================
  // CINEMATIC RANDOM
  // ======================================

  random: () => {

    pointer.rotateX = 15;
    pointer.rotateY = 20;

    utils.set(cards, {

      x: () => utils.random(-1200, 1200),

      y: () => utils.random(-1200, 1200),

      z: () => utils.random(-1600, 1600),

      rotateX: () => utils.random(-360, 360),

      rotateY: () => utils.random(-360, 360),

      rotateZ: () => utils.random(-360, 360),

      scale: () => utils.random(.5, 1.5),

      opacity: () => utils.random(.2, 1),

    });

  },

};

// ==========================================
// HOVER GLOW EFFECT
// ==========================================

cards.forEach(card => {

  card.addEventListener('mouseenter', () => {

    animate(card, {
      scale: 1.12,
      duration: 300,
      ease: 'outExpo'
    });

    card.style.zIndex = 999;

    card.style.boxShadow = `
      0 0 10px rgba(0,255,255,.5),
      0 0 30px rgba(0,255,255,.4),
      0 0 60px rgba(0,255,255,.3),
      0 0 100px rgba(0,255,255,.2)
    `;

  });

  card.addEventListener('mouseleave', () => {

    animate(card, {
      scale: 1,
      duration: 300,
      ease: 'outExpo'
    });

    card.style.zIndex = '';

    card.style.boxShadow = '';

  });

});

// ==========================================
// CARD EXPANSION
// ==========================================

document.addEventListener('click', event => {

  const $card =
    event.target.closest('#scene-content .element');

  if (!$card) return;

  const shouldExpand =
    !$card.classList.contains('is-expanded');

  elementsLayout.update(() => {

    cards.forEach($el =>
      $el.classList.remove('is-expanded')
    );

    if (shouldExpand) {
      $card.classList.add('is-expanded');
    }

    transformLayout[$sceneContent.dataset.layout]();

  }, {
    ease: spring({
      bounce: .3,
      duration: 600
    }),
  });

});

// ==========================================
// BUTTON TOGGLES
// ==========================================

const toggles =
  utils.$('.controls button.toggle');

document.addEventListener('click', event => {

  const $toggle =
    event.target.closest('.controls button.toggle');

  if (!$toggle) return;

  toggles.forEach(btn =>
    btn.classList.remove('is-active')
  );

  $toggle.classList.add('is-active');

  const layoutType = $toggle.id;

  elementsLayout.update(() => {

    cards.forEach($el =>
      $el.classList.remove('is-expanded')
    );

    $sceneContent.dataset.layout =
      layoutType;

    transformLayout[layoutType]();

  }, {
    delay: stagger([0, 1000], {
      from: 'center'
    }),
  });

});

// ==========================================
// ESC CLOSE
// ==========================================

document.addEventListener('keydown', event => {

  if (event.key !== 'Escape') return;

  elementsLayout.update(() => {

    cards.forEach($el =>
      $el.classList.remove('is-expanded')
    );

    transformLayout[$sceneContent.dataset.layout]();

  }, {
    ease: spring({
      bounce: .2,
      duration: 500
    }),
  });

});

// ==========================================
// FLOATING ANIMATION
// ==========================================

cards.forEach((card, i) => {

  animate(card, {

    y: [
      utils.random(-8, 0),
      utils.random(0, 8)
    ],

    duration: utils.random(2000, 4000),

    direction: 'alternate',

    loop: true,

    ease: 'inOutSine',

    delay: i * 10,

  });

});

// ==========================================
// INTRO CINEMATIC ANIMATION
// ==========================================

transformLayout.random();

utils.set(cards, {
  opacity: 0,
});

elementsLayout.update(() => {

  transformLayout.table();

}, {
  delay: stagger([0, 1400], {
    from: 'random'
  }),
});

// ==========================================
// AUTO CAMERA DRIFT
// ==========================================

animate(pointer, {

  rotateY: [20, 30],

  rotateX: [15, 22],

  duration: 6000,

  direction: 'alternate',

  loop: true,

  ease: 'inOutSine'

});
