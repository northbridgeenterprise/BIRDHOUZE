const loader = document.querySelector('.loader');
window.addEventListener('load', () => setTimeout(() => loader?.classList.add('done'), 650));
setTimeout(() => loader?.classList.add('done'), 1800);

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Controles escénicos de la portada: movimiento ligado al scroll, sin afectar
// el flujo del documento ni ejecutarse en pantallas táctiles o con movimiento reducido.
const heroSection = document.querySelector('.hero');
if (heroSection && !reducedMotion) {
  let sceneFrame = false;
  const updateHeroDepth = () => {
    const bounds = heroSection.getBoundingClientRect();
    const progress = Math.max(0, Math.min(1, -bounds.top / Math.max(1, bounds.height)));
    heroSection.style.setProperty('--hero-scroll', progress.toFixed(3));
    sceneFrame = false;
  };
  window.addEventListener('scroll', () => {
    if (!sceneFrame) {
      sceneFrame = true;
      requestAnimationFrame(updateHeroDepth);
    }
  }, { passive: true });
  updateHeroDepth();
}

// Parallax narrativo: las fotografías avanzan con el scroll, como una escena
// continua. Solo actualizamos las imágenes cercanas al viewport.
const scrollScenes = [...document.querySelectorAll(
  '.project-image img, .manifesto-image img, .contact-visual img, .team-photo img'
)];
if (scrollScenes.length && !reducedMotion) {
  const visibleScenes = new Set();
  const sceneObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.isIntersecting
      ? visibleScenes.add(entry.target)
      : visibleScenes.delete(entry.target));
    requestSceneFrame();
  }, { rootMargin: '18% 0px 18% 0px', threshold: 0 });
  scrollScenes.forEach(scene => sceneObserver.observe(scene));

  let sceneFrame = false;
  function requestSceneFrame() {
    if (sceneFrame) return;
    sceneFrame = true;
    requestAnimationFrame(() => {
      const viewport = window.innerHeight || 1;
      visibleScenes.forEach(scene => {
        const bounds = scene.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1,
          (viewport - bounds.top) / (viewport + bounds.height)
        ));
        scene.style.setProperty('--scene-progress', progress.toFixed(3));
      });
      sceneFrame = false;
    });
  }
  window.addEventListener('scroll', requestSceneFrame, { passive: true });
  window.addEventListener('resize', requestSceneFrame, { passive: true });
  requestSceneFrame();
}

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

const nav = document.querySelector('.nav');
const menuButton = document.querySelector('.menu-toggle');
menuButton?.addEventListener('click', () => {
  const open = nav.classList.toggle('menu-open');
  menuButton.setAttribute('aria-expanded', String(open));
});
document.querySelectorAll('.nav-links a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('menu-open');
  menuButton?.setAttribute('aria-expanded', 'false');
}));

// Mantiene orientada la navegación cuando se recorren secciones de esta página.
const sectionLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];
const sectionTargets = sectionLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
if ('IntersectionObserver' in window && sectionTargets.length) {
  const activeSections = new Set();
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.isIntersecting ? activeSections.add(entry.target) : activeSections.delete(entry.target));
    const current = [...activeSections].sort((a, b) => Math.abs(a.getBoundingClientRect().top - 110) - Math.abs(b.getBoundingClientRect().top - 110))[0];
    sectionLinks.forEach(link => {
      const active = current && link.hash === `#${current.id}`;
      link.classList.toggle('is-active', Boolean(active));
      if (active) link.setAttribute('aria-current', 'location'); else if (link.getAttribute('aria-current') === 'location') link.removeAttribute('aria-current');
    });
  }, { rootMargin: '-18% 0px -62% 0px', threshold: 0 });
  sectionTargets.forEach(target => sectionObserver.observe(target));
}

const hero = document.querySelector('.hero-image-wrap');
const heroImage = document.querySelector('.hero-image');
const heroLabel = document.querySelector('.hero-scene-label');
const heroCount = document.querySelector('.hero-count');
const heroScenes = [
  { src: 'IMAGENES/252682686_10159023003469442_2014153924867748887_n-f86c13a3-2500.jpg', alt: 'Producción lifestyle junto al mar', label: 'PRODUCIR PARA SENTIR', position: 'center 42%' },
  { src: 'IMAGENES/WOWTEC-81-e96a9309-1000.jpg', alt: 'Producción audiovisual en un evento de Monterrey', label: 'CAPTURAR EL MOMENTO', position: 'center 48%' },
  { src: 'IMAGENES/ELDUELO-21-04af89c1-2500.jpg', alt: 'Artista en escenario bajo una luz azul', label: 'CREAR PARA CONECTAR', position: 'center 48%' }
];
let activeScene = 0;
let sceneTimer;
function showScene(index) {
  activeScene = (index + heroScenes.length) % heroScenes.length;
  const scene = heroScenes[activeScene];
  heroImage.classList.add('changing');
  window.setTimeout(() => {
    heroImage.src = scene.src;
    heroImage.alt = scene.alt;
    heroImage.style.objectPosition = scene.position;
    heroLabel.textContent = scene.label;
    heroCount.textContent = `0${activeScene + 1} / 0${heroScenes.length}`;
    document.querySelectorAll('.hero-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === activeScene);
      if (i === activeScene) dot.setAttribute('aria-current', 'true'); else dot.removeAttribute('aria-current');
    });
    heroImage.classList.remove('changing');
  }, 180);
  window.clearInterval(sceneTimer);
  if (!reducedMotion) sceneTimer = window.setInterval(() => showScene(activeScene + 1), 6200);
}
document.querySelector('.hero-prev')?.addEventListener('click', () => showScene(activeScene - 1));
document.querySelector('.hero-next')?.addEventListener('click', () => showScene(activeScene + 1));
document.querySelectorAll('.hero-dot').forEach((dot, index) => dot.addEventListener('click', () => showScene(index)));
if (hero && !reducedMotion) {
  sceneTimer = window.setInterval(() => showScene(activeScene + 1), 6200);
  hero.addEventListener('mouseenter', () => window.clearInterval(sceneTimer));
  hero.addEventListener('mouseleave', () => { sceneTimer = window.setInterval(() => showScene(activeScene + 1), 6200); });
  hero.addEventListener('focusin', () => window.clearInterval(sceneTimer));
  hero.addEventListener('focusout', () => { sceneTimer = window.setInterval(() => showScene(activeScene + 1), 6200); });
  if (matchMedia('(pointer:fine)').matches) hero.addEventListener('pointermove', event => {
    const bounds = hero.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - .5;
    const y = (event.clientY - bounds.top) / bounds.height - .5;
    hero.style.setProperty('--pointer-x', `${x * 8}px`);
    hero.style.setProperty('--pointer-y', `${y * 8}px`);
  }, { passive: true });
}

const modal = document.querySelector('.project-modal');
document.querySelectorAll('.project').forEach(project => project.addEventListener('click', event => {
  event.preventDefault();
  modal.querySelector('.modal-image').src = project.dataset.image;
  modal.querySelector('.modal-image').alt = project.dataset.title;
  modal.querySelector('.modal-title').textContent = project.dataset.title;
  modal.querySelector('.modal-category').textContent = project.dataset.category;
  modal.querySelector('.modal-description').textContent = project.dataset.description;
  modal.showModal();
}));
document.querySelector('.modal-close')?.addEventListener('click', () => modal.close());
modal?.addEventListener('click', event => { if (event.target === modal) modal.close(); });
modal?.querySelector('.modal-contact')?.addEventListener('click', () => modal.close());

const progress = document.querySelector('.scroll-progress span');
let scrollTicking = false;
window.addEventListener('scroll', () => {
  if (scrollTicking) return;
  scrollTicking = true;
  requestAnimationFrame(() => {
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
    nav.classList.toggle('scrolled', scrollY > 30);
    scrollTicking = false;
  });
}, { passive: true });

const glow = document.querySelector('.cursor-glow');
if (glow && matchMedia('(pointer:fine) and (prefers-reduced-motion: no-preference)').matches) {
  window.addEventListener('pointermove', event => {
    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;
  }, { passive: true });
}

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

document.querySelectorAll('.team-photo img').forEach(image => image.addEventListener('error', () => {
  image.closest('.team-photo')?.classList.add('image-failed');
}, { once: true }));
