// Helpers
const $ = (q, ctx = document) => ctx.querySelector(q);
const $$ = (q, ctx = document) => [...ctx.querySelectorAll(q)];

// Año dinámico en el footer
const yearSpan = document.getElementById('y');
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// Toggle menú móvil

// Muestra el fondo de la navegación y cambia el logo al hacer scroll
const nav = $('.nav');
// NOMBRES DE ARCHIVOS
const LOGO_BLANCO_DESKTOP = 'assets/logos/logolbcblanco.png';
const LOGO_CHOCO_DESKTOP = 'assets/logos/logolbcchoco.png';
const LOGO_BLANCO_MOVIL = 'assets/logos/logoblancomovil.png';
const LOGO_CHOCO_MOVIL = 'assets/logos/logocafemovil.png'; // Usamos el mismo logo choco para ambos

// IDs DE ELEMENTOS
const navLogoDesktop = $('#nav-logo-desktop');
const navLogoMobile = $('#nav-logo-mobile');
const isHomePage = location.pathname.endsWith('/') || location.pathname.endsWith('index.html');
const rootStyle = document.documentElement.style;

const serviceNavGroups = [
  {
    label: 'Soluciones para Territorio y Biodiversidad',
    items: [
      { label: 'Ecología Aplicada y Evaluación de Biodiversidad', slug: 'ecologia-aplicada-evaluacion-biodiversidad' },
      { label: 'Conectividad Ecológica y Planificación Territorial', slug: 'conectividad-ecologica-planificacion-territorial' },
      { label: 'Paisaje, Valor Escénico y Relación Territorial', slug: 'paisaje-valor-escenico-relacion-territorial' },
      { label: 'Humedales y Ecosistemas Sensibles', slug: 'humedales-ecosistemas-sensibles' },
      { label: 'Evaluación de Suelo, Procesos Erosivos y Restauración Funcional', slug: 'evaluacion-suelo-procesos-erosivos-restauracion-funcional' },
    ]
  },
  {
    label: 'Cumplimiento y Gestión Ambiental',
    items: [
      { label: 'Estrategia Regulatoria y Gestión de Riesgo Ambiental', slug: 'estrategia-regulatoria-gestion-riesgo-ambiental' },
      { label: 'Seguimiento y Cumplimiento Ambiental', slug: 'gestion-estrategica-procedimientos-sma-cumplimiento-ambiental' },
      { label: 'Sostenibilidad y Reporte en Sistemas Productivos', slug: 'auditorias-certificaciones-agricolas' },
    ]
  },
  {
    label: 'Planificación y Gestión del Territorio',
    items: [
      { label: 'Planificación de Conservación y Gestión Territorial', slug: 'planificacion-conservacion-gestion-territorial' },
      { label: 'Restauración Ecológica y Soluciones Basadas en Naturaleza', slug: 'restauracion-ecologica-soluciones-basadas-en-naturaleza' }
    ]
  },
];

function buildServiceNavMarkup(variant) {
  const isMobile = variant === 'mobile';
  const servicesSectionHref = isHomePage ? '#servicios' : 'index.html#servicios';
  if (isMobile) {
    return `
      <a class="services-trigger services-trigger-mobile" href="${servicesSectionHref}">Servicios</a>
    `;
  }

  const categoriesMarkup = serviceNavGroups.map((group, index) => `
    <button
      type="button"
      class="services-category-button${index === 0 ? ' active' : ''}"
      data-services-category
      data-group-index="${index}"
      aria-expanded="${index === 0 ? 'true' : 'false'}"
    >${group.label}</button>
  `).join('');

  const submenuMarkup = serviceNavGroups[0].items.map(item => `
    <a class="services-link" href="servicio.html?slug=${item.slug}">${item.label}</a>
  `).join('');

  return `
    <button type="button" class="services-trigger" data-services-toggle aria-haspopup="true" aria-expanded="false">Servicios</button>
    <div class="services-menu services-menu-desktop" data-services-panel aria-hidden="true">
      <div class="services-menu-columns">
        <div class="services-category-column">
          ${categoriesMarkup}
        </div>
        <div class="services-submenu" data-services-submenu>
          ${submenuMarkup}
        </div>
      </div>
    </div>
  `;
}

function renderServiceNavs() {
  $$('[data-services-nav]').forEach(container => {
    const variant = container.dataset.variant || 'desktop';
    container.innerHTML = buildServiceNavMarkup(variant);
  });
}

renderServiceNavs();

function syncViewportMetrics() {
  if (!nav) return;
  const navHeight = Math.ceil(nav.getBoundingClientRect().height);
  rootStyle.setProperty('--nav-offset', `${navHeight}px`);
  rootStyle.setProperty('--viewport-under-nav', `calc(100svh - ${navHeight}px)`);
}

syncViewportMetrics();
window.addEventListener('resize', syncViewportMetrics);

function scrollToSection(targetId) {
  const target = document.getElementById(targetId);
  if (!target) return;

  const navHeight = nav ? nav.getBoundingClientRect().height : 0;
  const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;
  window.scrollTo({
    top: Math.max(targetTop, 0),
    behavior: 'smooth'
  });
}

function setupAllianceCarousel() {
  const alliancesGrid = document.querySelector('#alianzas [data-alliances-grid]');
  if (!alliancesGrid) return;

  const mobileQuery = window.matchMedia('(max-width: 768px)');
  const panel = alliancesGrid.closest('.clients-panel');
  let carousel = panel ? panel.querySelector('.client-logo-carousel') : null;

  function buildCarousel() {
    if (carousel || !panel) return;

    const items = [...alliancesGrid.children].map(item => item.cloneNode(true));
    const wrapper = document.createElement('div');
    wrapper.className = 'client-logo-carousel';
    wrapper.setAttribute('aria-label', 'Carrusel de clientes y partners');

    const viewport = document.createElement('div');
    viewport.className = 'client-logo-carousel-viewport';

    const track = document.createElement('div');
    track.className = 'client-logo-carousel-track';

    for (let i = 0; i < items.length; i += 4) {
      const slide = document.createElement('div');
      slide.className = 'client-logo-slide';
      items.slice(i, i + 4).forEach(item => {
        slide.appendChild(item);
      });
      track.appendChild(slide);
    }

    viewport.appendChild(track);
    wrapper.appendChild(viewport);

    const hint = document.createElement('p');
    hint.className = 'client-carousel-hint';
    hint.textContent = '↔';
    hint.setAttribute('aria-label', 'Desliza para ver más aliados');
    hint.title = 'Desliza para ver más aliados';
    wrapper.appendChild(hint);

    alliancesGrid.after(wrapper);
    carousel = wrapper;
  }

  function syncAllianceView() {
    const isMobile = mobileQuery.matches;

    if (isMobile) {
      buildCarousel();
      alliancesGrid.hidden = true;
      if (carousel) carousel.hidden = false;
    } else {
      alliancesGrid.hidden = false;
      if (carousel) carousel.hidden = true;
    }
  }

  syncAllianceView();

  if (typeof mobileQuery.addEventListener === 'function') {
    mobileQuery.addEventListener('change', syncAllianceView);
  } else if (typeof mobileQuery.addListener === 'function') {
    mobileQuery.addListener(syncAllianceView);
  }
}

$$('a[href="#alianzas"], a[href="index.html#alianzas"]').forEach(link => {
  link.addEventListener('click', event => {
    const isSamePageHash = link.getAttribute('href') === '#alianzas' && isHomePage;
    if (!isSamePageHash) return;
    event.preventDefault();
    scrollToSection('alianzas');
  });
});

setupAllianceCarousel();

function setupMobileCardCarousel({ sourceSelectors, insertAfterSelector, ariaLabel, hintText }) {
  const sources = sourceSelectors
    .map(selector => document.querySelector(selector))
    .filter(Boolean);
  const insertAfter = document.querySelector(insertAfterSelector);
  if (!sources.length || !insertAfter) return;

  const mobileQuery = window.matchMedia('(max-width: 768px)');
  const isKpiCarousel = sourceSelectors.some(selector => selector.includes('#kpis'));
  const isTeamCarousel = sourceSelectors.some(selector => selector.includes('#nosotros'));
  const items = sources.flatMap(source => [...source.children].map(child => child.cloneNode(true)));
  if (!items.length) return;

  const wrapper = document.createElement('div');
  wrapper.className = 'mobile-card-carousel';
  wrapper.setAttribute('aria-label', ariaLabel);

  const viewport = document.createElement('div');
  viewport.className = 'mobile-card-carousel-viewport';

  const track = document.createElement('div');
  track.className = 'mobile-card-carousel-track';

  items.forEach(item => {
    const slide = document.createElement('div');
    slide.className = 'mobile-card-slide';
    if (isKpiCarousel) {
      slide.classList.add('mobile-card-slide--kpi');
      const kpiCard = document.createElement('article');
      kpiCard.className = 'mobile-kpi-card';
      kpiCard.style.setProperty('width', 'min(100%, 340px)', 'important');
      kpiCard.style.setProperty('max-width', '340px', 'important');
      kpiCard.style.setProperty('margin', '0 auto', 'important');
      kpiCard.style.setProperty('aspect-ratio', '1 / 1', 'important');
      kpiCard.style.setProperty('display', 'flex', 'important');
      kpiCard.style.setProperty('align-items', 'center', 'important');
      kpiCard.style.setProperty('justify-content', 'center', 'important');
      kpiCard.style.setProperty('position', 'relative', 'important');

      const ring = document.createElement('div');
      ring.className = 'mobile-kpi-ring';
      ring.style.setProperty('width', '100%', 'important');
      ring.style.setProperty('height', '100%', 'important');
      ring.style.setProperty('display', 'flex', 'important');
      ring.style.setProperty('flex-direction', 'column', 'important');
      ring.style.setProperty('align-items', 'center', 'important');
      ring.style.setProperty('justify-content', 'center', 'important');
      ring.style.setProperty('text-align', 'center', 'important');
      ring.style.setProperty('padding', '1.9rem 1.15rem', 'important');
      ring.style.setProperty('border-radius', '50%', 'important');
      ring.style.setProperty('border', '10px solid rgba(239, 201, 177, 0.96)', 'important');
      ring.style.setProperty('background', 'radial-gradient(circle at 50% 42%, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0) 44%), linear-gradient(180deg, #6a1024 0%, #55091d 100%)', 'important');
      ring.style.setProperty('box-shadow', '0 14px 26px rgba(0, 0, 0, 0.22), inset 0 1px 0 rgba(255, 255, 255, 0.12), inset 0 -20px 28px rgba(0, 0, 0, 0.06)', 'important');
      ring.style.setProperty('color', '#f1d7c2', 'important');
      ring.style.setProperty('overflow', 'hidden', 'important');

      const kpiNumber = item.querySelector('b');
      const kpiLabel = item.querySelector('span');
      const number = document.createElement('b');
      const label = document.createElement('span');
      const kpiIndex = kpiNumber ? kpiNumber.getAttribute('data-kpi') : '';
      number.textContent = kpiNumber ? kpiNumber.textContent : '';
      label.textContent = kpiLabel ? kpiLabel.textContent : '';
      if (kpiIndex !== null && kpiIndex !== '') {
        number.setAttribute('data-kpi', kpiIndex);
      }
      number.style.setProperty('display', 'block', 'important');
      number.style.setProperty('font-size', 'clamp(4.9rem, 24vw, 7.2rem)', 'important');
      number.style.setProperty('line-height', '0.85', 'important');
      number.style.setProperty('margin', '0 0 0.12rem', 'important');
      number.style.setProperty('font-family', 'var(--font-display)', 'important');
      number.style.setProperty('font-weight', '500', 'important');
      number.style.setProperty('color', '#f7e6da', 'important');
      number.style.setProperty('text-shadow', '0 2px 12px rgba(0, 0, 0, 0.12)', 'important');
      label.style.setProperty('display', 'block', 'important');
      label.style.setProperty('max-width', '13ch', 'important');
      label.style.setProperty('font-size', '0.95rem', 'important');
      label.style.setProperty('line-height', '1.08', 'important');
      label.style.setProperty('letter-spacing', '0.08em', 'important');
      label.style.setProperty('margin', '0', 'important');
      label.style.setProperty('text-align', 'center', 'important');
      label.style.setProperty('color', '#f1d7c2', 'important');
      label.style.setProperty('font-weight', '700', 'important');

      ring.appendChild(number);
      ring.appendChild(label);
      kpiCard.appendChild(ring);
      slide.appendChild(kpiCard);
      track.appendChild(slide);
      return;
    }
    if (isTeamCarousel) {
      item.classList.add('mobile-team-card');
    }
    slide.appendChild(item);
    track.appendChild(slide);
  });

  viewport.appendChild(track);
  wrapper.appendChild(viewport);

  if (hintText) {
    const hint = document.createElement('p');
    hint.className = 'mobile-card-carousel-hint';
    hint.textContent = hintText;
    hint.setAttribute('aria-label', hintText);
    hint.title = hintText;
    wrapper.appendChild(hint);
  }

  insertAfter.insertAdjacentElement('afterend', wrapper);

  const syncView = () => {
    const isMobile = mobileQuery.matches;
    sources.forEach(source => {
      source.hidden = isMobile;
      source.style.setProperty('display', isMobile ? 'none' : '', 'important');
    });
    wrapper.hidden = !isMobile;
    wrapper.style.setProperty('display', isMobile ? 'block' : 'none', 'important');
    if (isKpiCarousel) {
      const kpiSection = document.getElementById('kpis');
      if (kpiSection) {
        kpiSection.style.setProperty('min-height', isMobile ? 'auto' : '', 'important');
        kpiSection.style.setProperty('padding-top', isMobile ? '18px' : '', 'important');
        kpiSection.style.setProperty('padding-bottom', isMobile ? '20px' : '', 'important');
        kpiSection.style.setProperty('background', isMobile ? 'linear-gradient(180deg, #4a061a 0%, #56091d 100%)' : '', 'important');
      }
    }
  };

  syncView();

  if (typeof mobileQuery.addEventListener === 'function') {
    mobileQuery.addEventListener('change', syncView);
  } else if (typeof mobileQuery.addListener === 'function') {
    mobileQuery.addListener(syncView);
  }
}

setupMobileCardCarousel({
  sourceSelectors: ['#kpis .kpi-grid', '#kpis .kpi-grid-row-2'],
  insertAfterSelector: '#kpis .kpi-grid-row-2',
  ariaLabel: 'Carrusel móvil de KPIs'
});

setupMobileCardCarousel({
  sourceSelectors: ['#nosotros .team-grid', '#nosotros .team-grid-technical'],
  insertAfterSelector: '#nosotros .team-grid-technical',
  ariaLabel: 'Carrusel móvil de integrantes del equipo',
  hintText: '↔'
});

function populateServicesSubmenu(navBlock, groupIndex) {
  const submenu = $('[data-services-submenu]', navBlock);
  const categories = $$('.services-category-button', navBlock);
  const group = serviceNavGroups[groupIndex];
  if (!submenu || !group) return;

  submenu.innerHTML = group.items.map(item => `
    <a class="services-link" href="servicio.html?slug=${item.slug}">${item.label}</a>
  `).join('');

  categories.forEach((button, index) => {
    const isActive = index === groupIndex;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-expanded', isActive ? 'true' : 'false');
  });
}

// Función para determinar el logo a actualizar
function getActiveLogo() {
    const isMobile = window.innerWidth <= 768; // Breakpoint de CSS
    return isMobile ? navLogoMobile : navLogoDesktop;
}

if (nav && isHomePage) {
  window.addEventListener('scroll', () => {
    const isScrolled = window.scrollY > 50;
    const activeLogo = getActiveLogo();

    if (isScrolled) {
      nav.classList.add('scrolled');
      if (activeLogo) {
        const logoChocoSrc = activeLogo === navLogoMobile ? LOGO_CHOCO_MOVIL : LOGO_CHOCO_DESKTOP;
        activeLogo.src = logoChocoSrc;
      }
    } else {
      nav.classList.remove('scrolled');
      if (activeLogo) {
        const logoBlancoSrc = activeLogo === navLogoMobile ? LOGO_BLANCO_MOVIL : LOGO_BLANCO_DESKTOP;
        activeLogo.src = logoBlancoSrc;
      }
    }
  }, { passive: true });
} else if (nav) {
  nav.classList.add('scrolled');
  if (navLogoDesktop) navLogoDesktop.src = LOGO_CHOCO_DESKTOP;
  if (navLogoMobile) navLogoMobile.src = LOGO_CHOCO_MOVIL;
}

const btn = $('#menuBtn'),
  mobileNav = $('#mobileNav'),
  mobileMenu = $('#mobileMenu');

btn.addEventListener('click', (event) => {
  event.preventDefault();
  const isOpen = mobileNav.classList.toggle('open');
  btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
});

mobileMenu.querySelectorAll('a, button').forEach(link => {
  link.addEventListener('click', () => {
    if (link.matches('button.services-trigger')) return;
    if (link.classList.contains('services-group-trigger')) return;
    mobileNav.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
  });
});

window.addEventListener('click', (event) => {
  if (!mobileNav || !mobileNav.classList.contains('open')) return;
  if (!mobileNav.contains(event.target)) {
    mobileNav.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
  }
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 768 && mobileNav.classList.contains('open')) {
    mobileNav.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
  }
});

$$('[data-services-nav]').forEach(navBlock => {
  const toggle = $('[data-services-toggle]', navBlock);
  const panel = $('[data-services-panel]', navBlock);

  if (!toggle || !panel) return;

  const closeNav = () => {
    navBlock.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    panel.setAttribute('aria-hidden', 'true');
  };

  const openNav = () => {
    navBlock.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    panel.setAttribute('aria-hidden', 'false');
    populateServicesSubmenu(navBlock, 0);
  };

  toggle.addEventListener('click', event => {
    event.preventDefault();
    if (navBlock.classList.contains('open')) {
      closeNav();
    } else {
      openNav();
    }
  });

  navBlock.addEventListener('mouseleave', () => {
    if (window.innerWidth > 768) {
      window.setTimeout(() => {
        if (!navBlock.matches(':hover') && !panel.matches(':hover')) {
          closeNav();
        }
      }, 220);
    }
  });

  navBlock.querySelectorAll('.services-category-button').forEach(button => {
    const groupIndex = Number(button.dataset.groupIndex || 0);
    button.addEventListener('mouseenter', () => {
      if (window.innerWidth > 768) populateServicesSubmenu(navBlock, groupIndex);
    });
    button.addEventListener('focus', () => populateServicesSubmenu(navBlock, groupIndex));
  });

  navBlock.querySelectorAll('.services-group-trigger').forEach(groupTrigger => {
    groupTrigger.addEventListener('click', () => {
      const group = groupTrigger.closest('.services-group');
      if (!group) return;
      const isOpen = group.classList.toggle('open');
      groupTrigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  });
});

window.addEventListener('click', event => {
  const servicesNavs = $$('[data-services-nav]');
  if (!servicesNavs.some(navBlock => navBlock.contains(event.target))) {
    servicesNavs.forEach(navBlock => {
      navBlock.classList.remove('open');
      const toggle = $('[data-services-toggle]', navBlock);
      const panel = $('[data-services-panel]', navBlock);
      toggle.setAttribute('aria-expanded', 'false');
      panel.setAttribute('aria-hidden', 'true');
      navBlock.querySelectorAll('.services-group.open').forEach(group => group.classList.remove('open'));
      navBlock.querySelectorAll('.services-group-trigger').forEach(button => button.setAttribute('aria-expanded', 'false'));
    });
  }
});

// Activa enlace de navegación según la sección visible (para One Page)
function setActiveNavLink(predicate) {
  ['.menu a', '.mobile-menu a'].forEach(selector => {
    $$(selector).forEach(a => {
      a.classList.remove('active');
      if (predicate(a)) a.classList.add('active');
    });
  });
}

function getNavSectionId(sectionId) {
  if (sectionId === 'proyectos-acceso') return 'kpis';
  return sectionId;
}

function markActiveOnScroll() {
  const sections = $$('section[id]');
  let ticking = false;

  const update = () => {
    ticking = false;
    const navHeight = nav ? Math.ceil(nav.getBoundingClientRect().height) : 0;
    const viewportBottom = window.innerHeight;
    let current = '';
    let bestScore = 0;

    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      const visibleTop = Math.max(rect.top, navHeight);
      const visibleBottom = Math.min(rect.bottom, viewportBottom);
      const visibleHeight = Math.max(0, visibleBottom - visibleTop);
      const score = rect.height > 0 ? visibleHeight / rect.height : 0;

      if (score > bestScore) {
        bestScore = score;
        current = getNavSectionId(section.id);
      }
    });

    setActiveNavLink(a => a.getAttribute('href').substring(1) === current);
  };

  const requestUpdate = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  };

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);
  update();
}

// Llama a la función si estamos en la página principal
if (isHomePage) {
  markActiveOnScroll();
} else {
  (function markActive() {
    const path = location.pathname.split('/').pop() || 'index.html';
    setActiveNavLink(a => {
      const href = a.getAttribute('href');
      if (!href) return false;
      const cleanHref = href.includes('#') ? href.split('#')[0] : href;
      return (cleanHref === '' && path === 'index.html') || cleanHref === path;
    });
  })();
}

// Ajusta el scroll de anclas para compensar con precisión la altura actual del navbar fijo
if (nav) {
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', event => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      const scrollTarget = target.id === 'servicios'
        ? target.querySelector('.split-feature-content-inner') || target
        : target;

      event.preventDefault();

      const navHeight = nav.getBoundingClientRect().height;
      const targetTop = scrollTarget.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({
        top: Math.max(0, targetTop),
        behavior: 'smooth'
      });

      if (location.hash !== href) {
        history.replaceState(null, '', href);
      }
    });
  });
}

// Envío de formularios con Netlify
// Handles Netlify form submission via AJAX
document.querySelectorAll('form[data-netlify="true"]').forEach(form => {
  form.addEventListener('submit', event => {
    event.preventDefault();

    const statusMessage = form.querySelector('.form-status');
    const formData = new FormData(form);
    
    if (statusMessage) {
      statusMessage.textContent = 'Enviando...';
      statusMessage.style.color = 'var(--ink-dark)';
    }

    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(formData).toString()
    })
    .then(() => {
      if (statusMessage) {
        statusMessage.textContent = '¡Gracias! Tu mensaje ha sido enviado.';
        statusMessage.style.color = 'var(--brand-teal)';
      }
      form.reset();
    })
    .catch(error => {
      if (statusMessage) {
        statusMessage.textContent = 'Error al enviar el formulario.';
        statusMessage.style.color = 'red';
      }
      console.error(error);
    });
  });
});

(function() {
  const contactModal = document.getElementById('indexContactModal');
  if (!contactModal) return;

  const openContactButtons = document.querySelectorAll('[data-open-contact-modal]');
  const closeContactButtons = contactModal.querySelectorAll('[data-close-contact-modal]');

  function openContactModal() {
    contactModal.classList.add('show');
    contactModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  }

  function closeContactModal() {
    contactModal.classList.remove('show');
    contactModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  }

  openContactButtons.forEach(button => button.addEventListener('click', openContactModal));
  closeContactButtons.forEach(button => button.addEventListener('click', closeContactModal));

  contactModal.addEventListener('click', event => {
    if (event.target === contactModal) {
      closeContactModal();
    }
  });

  window.addEventListener('keydown', event => {
    if (event.key === 'Escape' && contactModal.classList.contains('show')) {
      closeContactModal();
    }
  });
})();

// Contadores de KPIs desde Google Sheets (versión ajustada)
(function() {
  const kpiSection = document.getElementById('kpis');
  if (!kpiSection) return;

  const dateElement = document.getElementById('kpi-update-date');
  // Mostrar un mensaje de carga o por defecto inmediatamente
  if (dateElement) {
    dateElement.textContent = 'Cargando datos...';
  }

  // URL del archivo CSV de tu pestaña "KPIS"
  const sheetURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR-biUPUV4w-Ran2m80Wm5gw-d-IfxzvKdbq-D--OE5-8qVp4QY5C_gbcgAz5hk7yAfOKdBnpXVoNmY/pub?gid=1006059514&single=true&output=csv';

  function parseCsvLine(line) {
    const cells = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i += 1) {
      const char = line[i];
      const next = line[i + 1];

      if (char === '"' && inQuotes && next === '"') {
        current += '"';
        i += 1;
        continue;
      }

      if (char === '"') {
        inQuotes = !inQuotes;
        continue;
      }

      if (char === ',' && !inQuotes) {
        cells.push(current);
        current = '';
        continue;
      }

      current += char;
    }

    cells.push(current);
    return cells;
  }

  fetch(sheetURL)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return response.text();
    })
    .then(csvText => {
      const rows = csvText.split(/\r?\n/).map(row => row.trim()).filter(Boolean);
      // Apunta a la fila 1000 (índice 999), pero cae al último dato útil si la hoja cambia
      const kpiRow = rows[999] || rows[rows.length - 1] || '';
      const kpiValues = parseCsvLine(kpiRow);

      // 1. Extrae la fecha de la segunda columna (índice 1)
      const updateDate = kpiValues[1];

      // 2. Inserta el texto con la fecha en el párrafo
      if (dateElement) {
        // Usa una comprobación simple para asegurar que la fecha no esté vacía
        if (updateDate && updateDate.trim() !== '') {
            dateElement.textContent = `KPIs actualizados a ${updateDate.trim()}`;
            dateElement.style.color = '';
        } else {
            // Si la columna de fecha está vacía, muestra un mensaje estándar
            dateElement.textContent = 'KPIs actualizados recientemente.';
            dateElement.style.color = '';
        }
      }

      const els = kpiSection.querySelectorAll('[data-kpi]');
      if (!els.length) return;

      const dur = 900;

      // MODIFICACIÓN: La función animate ahora acepta prefijo y sufijo
      function animate(el, target, prefix = '', suffix = '') {
        const kpiKey = el.getAttribute('data-kpi');
        const t0 = performance.now();
        (function tick(now) {
          const p = Math.min(1, (now - t0) / dur);
          const currentValue = Math.floor(0 + (target - 0) * (0.5 - Math.cos(Math.PI * p) / 2));
          // MODIFICACIÓN: Aplica prefijo y sufijo al contenido del elemento
          const valueText = prefix + currentValue + suffix;
          if (kpiKey !== null) {
            const kpiTargets = kpiSection.querySelectorAll(`[data-kpi="${kpiKey}"]`);
            kpiTargets.forEach(targetEl => {
              targetEl.textContent = valueText;
            });
          } else {
            el.textContent = valueText;
          }
          if (p < 1) requestAnimationFrame(tick);
        })(t0);
      }

      const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting && !e.target.dataset.done) {
            e.target.dataset.done = 1;
            const kpiIndex = parseInt(e.target.getAttribute('data-kpi'), 10);
            const targetValue = parseInt((kpiValues[kpiIndex + 2] || '0').replace(/[^\d-]/g, ''), 10);
            
            let prefix = '';
            let suffix = '';
            
            // Lógica para KPI 4 eliminada.

          // MODIFICACIÓN: Añade prefijo para el KPI de Años (index 0)
            if (kpiIndex === 0) {
              prefix = '>';
            }

         // MODIFICACIÓN: Añade prefijo para el KPI de proyectos (index 3)
            if (kpiIndex === 3) {
              prefix = '>';
            }
            
            // MODIFICACIÓN: Pasa los nuevos argumentos a animate
            animate(e.target, targetValue, prefix, suffix);
          }
        });
      }, { threshold: 0.4 });

      els.forEach(el => io.observe(el));
    })
    .catch(error => {
      console.error('Error al cargar los datos de KPIs:', error);
      // Muestra un mensaje de error si la carga falla
      if (dateElement) {
        dateElement.textContent = 'Error al cargar datos de actualización.';
        dateElement.style.color = 'red'; 
      }
      const els = kpiSection.querySelectorAll('[data-kpi]');
      els.forEach(el => el.textContent = '0'); // Muestra '0' si hay un error
    });
})();


/* =========================================================
   FUNCIONALIDAD PARA MÚLTIPLES ACORDEONES
   ========================================================= */
(function() {
  const accordionContainers = document.querySelectorAll('.accordion-container');
  if (!accordionContainers.length) return;

  accordionContainers.forEach(container => {
    const items = container.querySelectorAll('.accordion-item');
    items.forEach(item => {
      const header = item.querySelector('.accordion-header');
      header.addEventListener('click', () => {
        const currentActive = container.querySelector('.accordion-item.active');
        if (currentActive && currentActive !== item) {
          currentActive.classList.remove('active');
        }
        item.classList.toggle('active');
      });
    });
  });
})();

/* =========================================================
   PÁGINA DINÁMICA DE PROYECTOS
   ========================================================= */
(function() {
  const projectPage = document.querySelector('[data-project-page]');
  if (!projectPage) return;

  const projectMetaDescription = document.getElementById('project-meta-description');
  const projectTags = document.getElementById('project-tags') || document.querySelector('.service-meta-row');
  const projectTitle = document.getElementById('project-title');
  const projectSummary = document.getElementById('project-summary');
  const projectHighlight = document.getElementById('project-highlight');
  const projectDescription = document.getElementById('project-description');
  const projectDeliverables = document.getElementById('project-deliverables');
  const projectMethodologies = document.getElementById('project-methodologies');
  const projectCtaText = document.getElementById('project-cta-text');
  const projectPartnersSection = document.getElementById('project-partners-section');
  const projectPartnersGrid = document.getElementById('project-partners-grid');
  const projectHero = document.querySelector('.project-page .service-hero');
  const projectHeroBg = document.querySelector('.project-page .service-hero-bg');

  const projectCatalog = {
    agricultura: {
      title: 'Plan de Fomento y Conservación de la Biodiversidad',
      summary: 'Levantamiento integral de flora, fauna y suelos para auditorías y planes de mejora ambiental en predios agrícolas.',
      tags: ['Agricultura', 'Biodiversidad', 'Auditoría ambiental', 'Planes de conservación'],
      heroImage: 'assets/img/proyecto1.jpg',
      highlight: 'Desarrollamos un levantamiento integral de biodiversidad y condición edáfica para sustentar decisiones de mejora, conservación y manejo en predios agrícolas.',
      description: [
        'En el contexto de auditoría de la norma LEAF 16.1, se desarrolló un levantamiento integral de flora, fauna y condición biológica de suelos en cinco predios agrícolas de las regiones Metropolitana y de Coquimbo, con superficies que van desde 80 hasta más de 1.000 hectáreas.',
        'El proyecto contempló una auditoría sistemática de biodiversidad y conservación del paisaje orientada a caracterizar hábitats naturales y seminaturales, identificar formaciones vegetacionales y evaluar la biodiversidad intrapredial mediante levantamientos de flora, fauna terrestre e insectos benéficos. La metodología integró análisis cartográfico, prospecciones en terreno, transectos de fauna, estaciones de observación y cámaras trampa, junto con la delimitación de usos y coberturas de suelo, permitiendo establecer una línea base ecológica robusta como base para la planificación de acciones de conservación y mejora ambiental en cada predio.',
        'Con base en esta caracterización, el eje central del proyecto fue el diseño e implementación de un Plan de Mejora y Conservación de la Naturaleza, orientado al fomento activo de la biodiversidad dentro del sistema productivo agrícola. Este plan incorporó objetivos de corto y largo plazo, especies y grupos focales prioritarios, indicadores verificables y mecanismos de seguimiento para institucionalizar la gestión de la biodiversidad a nivel predial. Entre las medidas propuestas destacaron el establecimiento de bandas de flores con especies nativas para favorecer polinizadores e insectos benéficos, la instalación de hábitats para aves insectívoras y lechuzas como controladores biológicos de plagas, programas de protección de fauna nativa y acciones de capacitación para integrar progresivamente la conservación del paisaje y la biodiversidad en la toma de decisiones agrícolas. El enfoque buscó armonizar productividad y funcionalidad ecológica, fortaleciendo servicios ecosistémicos clave y contribuyendo al cumplimiento de los principios de agricultura sostenible promovidos por LEAF.'
      ],
      deliverables: [
        'Levantamiento de formaciones vegetacionales',
        'Registro de especies nativas y endémicas',
        'Evaluación de calidad biológica del suelo',
        'Planes de mejora y conservación por predio',
        'Lineamientos de capacitación y monitoreo',
        'Acciones de restauración ecológica'
      ],
      methodologies: [
        'Revisión de antecedentes y auditoría técnica',
        'Campañas de terreno en predios agrícolas',
        'Evaluación de flora, fauna y suelos',
        'Síntesis de hallazgos y recomendaciones de manejo'
      ],
      partners: [
        { src: 'assets/clientes/10.png', alt: 'Westfalia Fruit', url: 'https://westfaliafruit.com/' },
        { src: 'assets/clientes/27.png', alt: 'Agroalto', url: 'https://agroalto.cl/' }
      ],
      cta: 'Si necesitas evaluar biodiversidad y suelos en un contexto agrícola, podemos ayudar a estructurar el alcance técnico y los pasos siguientes.'
    },
    paitur: {
      title: 'Medidas de fomento de fauna silvestre',
      summary: 'Diseño de medidas de enriquecimiento de hábitat para especies silvestres asociadas a proyectos energéticos.',
      tags: ['Parque fotovoltaico', 'Fauna silvestre', 'Medidas de compensación'],
      heroImage: 'assets/img/proyecto2.jpg',
      highlight: 'Diseñamos medidas de enriquecimiento de hábitat para reducir impactos y mejorar las condiciones de refugio y uso de especies silvestres en entornos energéticos.',
      description: [
        'Desarrollamos Planes de Enriquecimiento de Hábitat orientados a fortalecer las condiciones ecológicas de Áreas asociadas a proyectos de infraestructura, energía y desarrollo territorial, mediante el diseño e implementación de medidas específicas para el fomento de fauna silvestre y la recuperación funcional de microhábitats. Estos estudios integran análisis territorial, evaluación de atributos biofísicos del paisaje y criterios ecológicos de selección de sitio, permitiendo identificar sectores con mayor aptitud para la implementación de medidas de conservación y enriquecimiento ecológico.',
        'El servicio considera el diseño de estrategias de manejo adaptadas a especies o grupos focales, incorporando criterios de disponibilidad de refugio, termorregulación, conectividad ecológica y uso potencial del hábitat, con énfasis en mejorar las condiciones de permanencia de fauna silvestre en entornos intervenidos. Asimismo, contempla la planificación espacial de medidas, especificaciones técnicas para su implementación, verificación en terreno y mecanismos de seguimiento que aseguren trazabilidad y efectividad ecológica.',
        'Nuestro enfoque busca compatibilizar el desarrollo de proyectos con la conservación de la biodiversidad, promoviendo soluciones basadas en la ecología del paisaje y en evidencia técnica para contribuir tanto al cumplimiento ambiental como al fortalecimiento de la funcionalidad ecosistémica local.'
      ],
      partners: [
        { src: 'assets/clientes/18.png', alt: 'ECOS', url: 'https://ecos-chile.com/' }
      ],
      deliverables: [
        'Diagnóstico de sensibilidad del Área',
        'Diseño de medidas de enriquecimiento de hábitat',
        'Zonificación de intervención',
        'Recomendaciones para seguimiento y monitoreo'
      ],
      methodologies: [
        'Análisis SIG y territorial',
        'Evaluación de sensibilidad ambiental',
        'Diseño de medidas de fomento de fauna',
        'Definición de acciones de seguimiento'
      ],
      cta: 'Si tu proyecto energético requiere medidas de fomento de fauna, podemos ayudarte a definir una estrategia robusta y aplicable.'
    },
    delhum: {
      title: 'Delimitación de Humedales Urbanos',
      summary: 'Delimitación técnica de humedales urbanos para cumplir con la normativa y orientar decisiones territoriales.',
      tags: ['Inmobiliario', 'Humedales urbanos', 'Ley N° 21.202'],
      heroImage: 'assets/img/proyecto3.jpg',
      highlight: 'Realizamos delimitaciones técnicas de humedales urbanos para respaldar cumplimiento normativo y orientar la planificación territorial del proyecto.',
      description: [
        'Desarrollamos Estudios de Delimitación de Humedales Urbanos en el marco de la Ley N° 21.202 y su reglamento, orientados a determinar técnicamente la presencia, extensión y límites de ecosistemas humedales en contextos urbanos o periurbanos. Estos estudios integran análisis normativo, levantamiento de antecedentes territoriales, fotointerpretación histórica mediante sensores remotos y evaluación ecológica en terreno, conforme a la Guía de Delimitación y Caracterización de Humedales Urbanos de Chile del Ministerio del Medio Ambiente.',
        'La metodología considera la evaluación integrada de los tres criterios oficiales de delimitación: régimen hidrológico, vegetación hidrófita y suelos hídricos, mediante campañas de terreno, transectos de muestreo, caracterización vegetacional, prospección edáfica y análisis espacial SIG. Este enfoque permite sustentar técnicamente la presencia o ausencia de humedales, definir límites con precisión cartográfica y generar insumos robustos para procesos de planificación territorial, evaluación ambiental, desarrollo inmobiliario y gestión de riesgos regulatorios asociados a humedales urbanos.'
      ],
      partners: [
        { name: 'Patagua', logo: 'assets/clientes/31.png', url: 'https://www.patagua.cl/' },
        { name: 'Urbano Proyectos', logo: 'assets/clientes/5.png', url: 'https://www.urbanoproyectos.com/' },
        { name: 'JACS Consulting', logo: 'assets/clientes/30.png', url: 'https://jacsconsulting.cl/' }
      ],
      deliverables: [
        'Informe técnico de delimitación',
        'Evaluación de criterios hidrológicos, edáficos y florísticos',
        'Cartografía temática y delimitación geoespacial',
        'Bases para evaluación normativa y territorial'
      ],
      methodologies: [
        'Reglamento de la Ley N° 21.202',
        'Guía de Delimitación y Caracterización de Humedales Urbanos de Chile',
        'Calicatas, parcelas florísticas y puntos hidrológicos',
        'Superposición cartográfica aditiva de criterios'
      ],
      cta: 'Si necesitas delimitar un humedal urbano con respaldo técnico, podemos ayudarte a estructurar el estudio y su compatibilidad territorial.'
    },
    municipalidad: {
      title: 'Estrategia de Retención Hídrica',
      summary: 'Diseño de una estrategia basada en la naturaleza para fortalecer resiliencia hídrica y territorial.',
      tags: ['Áreas silvestres', 'Soluciones basadas en la naturaleza', 'Gestión hídrica'],
      heroImage: 'assets/img/proyecto4.jpg',
      highlight: 'Diseñamos una estrategia de retención hídrica con enfoque territorial y soluciones basadas en la naturaleza para fortalecer resiliencia frente a la crisis hídrica.',
      description: [
        'En respuesta a la crisis hídrica estructural que enfrenta la Región Metropolitana, desarrollamos una Estrategia Integral de Retención Hídrica basada en Soluciones basadas en la Naturaleza (SbN) para las más de 5.400 hectáreas administradas por la Asociación Parque Cordillera en la precordillera de Santiago. El proyecto tuvo como objetivo fortalecer la resiliencia territorial frente al cambio climático, mejorando la capacidad del paisaje para infiltrar, almacenar y regular agua, en un territorio estratégico para la seguridad hídrica metropolitana.',
        'La estrategia integró análisis biofísico, modelación hidrológica, evaluación multicriterio y validación social participativa, combinando variables territoriales como topografía, infiltración, humedad, cobertura vegetal, régimen hídrico y comportamiento ecosistémico, junto con la revisión de experiencias nacionales e internacionales en restauración hídrica de paisajes de montaña. El trabajo permitió priorizar medidas de alto potencial, como obras de conservación de agua y suelo, restauración de coberturas vegetales y sistemas de infiltración, bajo criterios de factibilidad técnica, ecológica, social y económica.',
        'Adicionalmente, el proyecto incorporó un componente de gobernanza territorial y participación de actores clave, mediante entrevistas a especialistas, instituciones y usuarios del territorio, permitiendo validar socialmente la propuesta y posicionar la precordillera como una infraestructura natural clave para enfrentar la escasez hídrica, reducir riesgos ecosistémicos y fortalecer la conservación de biodiversidad a escala metropolitana.'
      ],
      partners: [
        { src: 'assets/clientes/3.png', alt: 'Asociación Parque Cordillera', url: 'https://asociacionparquecordillera.cl/' },
        { src: 'assets/clientes/12.png', alt: 'Aguas Andinas', url: 'https://www.aguasandinas.cl/' }
      ],
      deliverables: [
        'Propuesta de estrategia territorial',
        'Zonificación multicriterio',
        'Revisión de experiencias nacionales e internacionales',
        'Entrevistas y validación con actores especializados',
        'Ejes estratégicos de implementación'
      ],
      methodologies: [
        'Revisión bibliográfica especializada',
        'Análisis multicriterio',
        'Entrevistas semi-estructuradas',
        'Integración de soluciones basadas en la naturaleza'
      ],
      cta: 'Si tu territorio necesita una estrategia hídrica con enfoque ecosistémico, podemos ayudarte a diseñar el alcance y la ruta de implementación.'
    },
    restauracionecologica: {
      title: 'Restauración ecológica',
      summary: 'Actualización de un plan de restauración post-cierre con enfoque adaptativo y metas de recuperación ecosistémica.',
      tags: ['Relleno sanitario', 'Restauración ecológica', 'Evaluación, diseño y ejecución'],
      heroImage: 'assets/img/proyecto5.jpg',
      highlight: 'Actualizamos un plan de restauración con enfoque adaptativo, zonificación diferenciada y metas verificables para recuperación ecosistémica de largo plazo.',
      description: [
        'En el marco del seguimiento ambiental post-cierre del Relleno Sanitario Santiago Poniente, desarrollamos para Veolia la actualización integral del Plan de Restauración Ecológica para un Área de 27,2 hectáreas de laderas periurbanas en la Región Metropolitana, asociada al cumplimiento de compromisos ambientales establecidos en la RCA del proyecto. El trabajo tuvo como objetivo redefinir la trayectoria de recuperación ecosistémica del sitio, integrando el contexto actual de cambio climático, los resultados de monitoreo de terreno y los avances científicos en restauración ecológica.',
        'El proyecto combinó líneas de base ecológicas, campañas de terreno, evaluación de unidades vegetacionales, monitoreo de parcelas piloto y análisis de ecosistemas de referencia, permitiendo identificar brechas críticas en estructura, funcionalidad y regeneración del ecosistema. Se realizaron campañas específicas de caracterización vegetacional mediante parcelas de muestreo, evaluación de funcionalidad ecológica y visitas técnicas a ecosistemas de referencia para orientar las decisiones de restauración bajo criterios ecológicos robustos.',
        'La actualización del plan se desarrolló bajo los Principios y Estándares Internacionales de la Society for Ecological Restoration (SER), incorporando evaluación de amenazas, cambio climático, conectividad ecológica, restauración de suelos, control de erosión, enriquecimiento con especies nativas, rehabilitación de hábitat y manejo de fauna. Como resultado, se definieron estrategias diferenciadas de restauración, metas de recuperación medibles y un programa de manejo adaptativo de largo plazo orientado a recuperar un refugio de biodiversidad clave en un entorno altamente presionado por actividades antrópicas.'
      ],
      partners: [
        { src: 'assets/clientes/17.png', alt: 'Veolia', url: 'https://www.veolia.cl/' }
      ],
      deliverables: [
        'Actualización del Plan de Restauración',
        'Zonificación de manejo y restauración',
        'Definición de factores limitantes',
        'Metas de recuperación a 10 años',
        'Estrategias de manejo adaptativo'
      ],
      methodologies: [
        'Estándares SER para restauración ecológica',
        'Caracterización de unidades vegetacionales',
        'Evaluación de flora y fauna vascular',
        'Definición de estrategias de manejo adaptativo'
      ],
      cta: 'Si tu proyecto requiere restauración post-cierre o manejo adaptativo, podemos ayudarte a definir el plan técnico.'
    }
  };

  const slug = new URLSearchParams(location.search).get('slug') || 'agricultura';
  const projectData = projectCatalog[slug] || projectCatalog.agricultura;

  if (projectMetaDescription) {
    const projectTagsList = Array.isArray(projectData.tags) ? projectData.tags.filter(Boolean) : [];
    const projectKeywords = projectTagsList.join(', ');
    const projectTitleTags = projectTagsList.slice(0, 3).join(' | ');

    projectMetaDescription.setAttribute(
      'content',
      `${projectData.summary}${projectKeywords ? ` | ${projectKeywords}` : ''}`
    );

    document.title = `${projectData.title}${projectTitleTags ? ` | ${projectTitleTags}` : ''} - Proyectos | LBC Consultores Ambientales`;

    const projectJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: projectData.title,
      description: projectData.summary,
      keywords: projectKeywords,
      url: location.href.split('#')[0],
      genre: projectData.tags?.[0] || 'Proyecto',
      provider: {
        '@type': 'Organization',
        name: 'LBC Consultores Ambientales',
        url: 'https://lbconservation.org'
      }
    };

    let jsonLdScript = document.getElementById('project-jsonld');
    if (!jsonLdScript) {
      jsonLdScript = document.createElement('script');
      jsonLdScript.type = 'application/ld+json';
      jsonLdScript.id = 'project-jsonld';
      document.head.appendChild(jsonLdScript);
    }
    jsonLdScript.textContent = JSON.stringify(projectJsonLd);
  }

  if (projectTags) {
    const tags = Array.isArray(projectData.tags) ? projectData.tags : [];
    projectTags.innerHTML = tags.length
      ? tags.map(tag => `<span class="service-pill">${tag}</span>`).join('')
      : '<span class="service-pill">Proyecto</span>';
  }
  if (projectTitle) projectTitle.textContent = projectData.title;
  if (projectSummary) projectSummary.textContent = projectData.summary;
  if (projectHighlight) projectHighlight.textContent = projectData.highlight;
  if (projectCtaText) projectCtaText.textContent = projectData.cta;

  function renderParagraphs(container, paragraphs) {
    if (!container) return;
    container.innerHTML = '';
    paragraphs.forEach(text => {
      const p = document.createElement('p');
      p.textContent = text;
      container.appendChild(p);
    });
  }

  function renderList(container, items) {
    if (!container) return;
    container.innerHTML = '';
    items.forEach(text => {
      const li = document.createElement('li');
      li.textContent = text;
      container.appendChild(li);
    });
  }

  renderParagraphs(projectDescription, projectData.description);
  renderList(projectDeliverables, projectData.deliverables);
  renderList(projectMethodologies, projectData.methodologies);

  if (projectPartnersSection && projectPartnersGrid) {
    const partners = projectData.partners || [];
    projectPartnersGrid.innerHTML = partners.map(partner => `
      <div class="client-logo-item">
        ${partner.url ? `<a class="client-logo-link" href="${partner.url}" target="_blank" rel="noopener noreferrer" aria-label="${partner.alt || partner.name || 'Cliente'}">` : '<div class="client-logo-link">'}
          <img src="${partner.src || partner.logo || ''}" alt="${partner.alt || partner.name || 'Cliente'}" />
        ${partner.url ? '</a>' : '</div>'}
      </div>
    `).join('');
    projectPartnersSection.hidden = partners.length === 0;
  }

  if (projectHeroBg && projectData.heroImage) {
    const heroImageProbe = new Image();
    heroImageProbe.onload = () => {
      projectHeroBg.style.backgroundImage = `url("${projectData.heroImage}")`;
      projectHeroBg.style.backgroundPosition = projectData.heroPosition || 'center center';
    };
    heroImageProbe.onerror = () => {
      projectHeroBg.style.backgroundImage = 'url("assets/img/fondo_servicios.jpg")';
      projectHeroBg.style.backgroundPosition = 'center center';
    };
    heroImageProbe.src = projectData.heroImage;
  }

  if (projectHero && projectHeroBg) {
    let ticking = false;

    const updateProjectHeroParallax = () => {
      const scrollY = window.scrollY || 0;
      const offset = Math.min(scrollY * 0.16, 48);
      projectHeroBg.style.transform = `translateY(${offset}px) scale(1.06)`;
      ticking = false;
    };

    const requestUpdate = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateProjectHeroParallax);
    };

    updateProjectHeroParallax();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate, { passive: true });
  }

  document.body.classList.remove('service-loading');
  document.body.classList.add('service-ready');
})();

/* =========================================================
   PÁGINA DE PROYECTOS
   ========================================================= */
(function() {
  const projectsPage = document.querySelector('#proyectos-page');
  if (!projectsPage) return;

  const projectFeatures = document.querySelectorAll('#proyectos-page .project-feature');
  if (!projectFeatures.length) return;

  projectFeatures.forEach(feature => {
    const media = feature.querySelector('.project-feature-media');
    const mediaImage = media.querySelector('img');
    if (!media || !mediaImage) return;

    const src = mediaImage.getAttribute('src');
    if (!src) return;
    const projectKey = feature.dataset.project || '';
    const backgroundPositionByProject = {
      agricultura: 'left center',
      paitur: 'right center',
      delhum: '0% center',
      municipalidad: 'right center',
      restauracionecologica: 'left center'
    };
    const backgroundSizeByProject = {
      paitur: '88% auto'
    };
    media.style.backgroundImage = `url("${src}")`;
    media.style.backgroundRepeat = 'no-repeat';
    media.style.backgroundSize = backgroundSizeByProject[projectKey] || '78% auto';
    media.style.backgroundPosition = backgroundPositionByProject[projectKey] || 'center center';
    media.style.backgroundAttachment = window.matchMedia('(min-width: 1025px)').matches ? 'fixed' : 'scroll';
    media.style.transform = 'none';
    mediaImage.style.display = 'none';
    mediaImage.style.transform = 'none';
  });
})();

/* =========================================================
   PÁGINA DINÁMICA DE SERVICIOS
   ========================================================= */
(function() {
  const servicePage = document.querySelector('[data-service-page]');
  if (!servicePage) return;

  const serviceMetaDescription = document.getElementById('service-meta-description');
  const serviceTags = document.getElementById('service-tags') || document.querySelector('.service-meta-row');
  const serviceTitle = document.getElementById('service-title');
  const serviceSummary = document.getElementById('service-summary');
  const serviceHighlight = document.getElementById('service-highlight');
  const serviceDescription = document.getElementById('service-description');
  const serviceDeliverables = document.getElementById('service-deliverables');
  const serviceMethodologies = document.getElementById('service-methodologies');
  const serviceCtaText = document.getElementById('service-cta-text');
  const serviceHero = document.querySelector('.service-page .service-hero');
  const contactModal = document.getElementById('serviceContactModal');
  const contactModalLead = document.getElementById('contactModalLead');
  const modalServiceSelect = document.getElementById('modalServiceSelect');
  const modalServiceContext = document.getElementById('modalServiceContext');
  const openContactButtons = document.querySelectorAll('[data-open-contact-modal]');
  const closeContactButtons = document.querySelectorAll('[data-close-contact-modal]');

  const serviceCatalog = {
    'conectividad-ecologica-planificacion-territorial': {
      title: 'Conectividad Ecológica y Planificación Territorial',
      summary: 'Analizamos conectividad ecológica, fragmentación territorial y continuidad visual para respaldar decisiones de diseño y evaluación ambiental.',
      tags: ['Soluciones para Territorio y Biodiversidad', 'Conectividad ecológica', 'Planificación territorial']
    },
    'paisaje-valor-escenico-relacion-territorial': {
      title: 'Paisaje, Valor Escénico y Relación Territorial',
      summary: 'Evaluamos atributos paisajísticos, escénicos y territoriales bajo metodología SEA para proyectos sometidos al SEIA.',
      tags: ['Soluciones para Territorio y Biodiversidad', 'Paisaje escénico', 'Relación territorial', 'SEIA'],
      detailed: true
    },
    'ecologia-aplicada-evaluacion-biodiversidad': {
      title: 'Ecología Aplicada y Evaluación de Biodiversidad',
      summary: 'Integramos líneas base de flora y fauna, evaluación de biodiversidad y rescate y relocalización de especies para respaldar decisiones ambientales y territoriales.',
      tags: ['Soluciones para Territorio y Biodiversidad', 'Biodiversidad', 'Flora y Fauna', 'Rescate y Relocalización'],
      detailed: true
    },
    'evaluacion-suelo-procesos-erosivos-restauracion-funcional': {
      title: 'Evaluación de Suelo, Procesos Erosivos y Restauración Funcional',
      summary: 'Desarrollamos evaluaciones edáficas y de procesos erosivos para proyectos sometidos al SEIA, identificando condiciones de suelo, susceptibilidad a erosión y oportunidades de conservación y restauración funcional.',
      tags: ['Soluciones para Territorio y Biodiversidad', 'Suelo', 'Erosión', 'Restauración funcional', 'Conservación de suelo y agua'],
      detailed: true
    },
    'humedales-ecosistemas-sensibles': {
      title: 'Humedales y Ecosistemas Sensibles',
      summary: 'Evaluamos y caracterizamos humedales y ecosistemas sensibles conforme a la normativa y criterios técnicos aplicables.',
      tags: ['Soluciones para Territorio y Biodiversidad', 'Humedales', 'Ecosistemas sensibles', 'Gestión integral']
    },
    'gestion-estrategica-procedimientos-sma-cumplimiento-ambiental': {
      title: 'Seguimiento y Cumplimiento Ambiental',
      summary: 'Integramos análisis de cargos, planes de cumplimiento y seguimiento para ordenar la respuesta técnica y documental frente a procesos SMA.',
      tags: ['Cumplimiento y Gestión Ambiental', 'SMA', 'PdC', 'Cumplimiento ambiental'],
      detailed: true
    },
    'auditorias-certificaciones-agricolas': {
      title: 'Sostenibilidad y Reporte en Sistemas Productivos',
      summary: 'Revisamos brechas de sostenibilidad, trazabilidad y reporte para fortalecer sistemas productivos con enfoque ambiental.',
      tags: ['Cumplimiento y Gestión Ambiental', 'Sostenibilidad', 'Reporte', 'Sistemas productivos']
    },
    'estrategia-regulatoria-gestion-riesgo-ambiental': {
      title: 'Estrategia Regulatoria y Gestión de Riesgo Ambiental',
      summary: 'Integramos permisos ambientales, tramitación sectorial y compromisos de cumplimiento para ordenar la estrategia regulatoria y reducir riesgos ambientales del proyecto.',
      tags: ['Cumplimiento y Gestión Ambiental', 'PAS', 'CONAF', 'SAG', 'CAV', 'Gestión de riesgo'],
      detailed: true
    },
    'restauracion-ecologica-soluciones-basadas-en-naturaleza': {
      title: 'Restauración Ecológica y Soluciones Basadas en Naturaleza',
      summary: 'Diseñamos y ejecutamos rutas de restauración con objetivos verificables, priorización de acciones, reforestación y soluciones basadas en naturaleza.',
      tags: ['Planificación y Gestión del Territorio', 'Restauración ecológica', 'SbN', 'Reforestación']
    },
    'planificacion-conservacion-gestion-territorial': {
      title: 'Planificación de Conservación y Gestión Territorial',
      summary: 'Ordenamos criterios territoriales y ecológicos para estructurar conservación y gestión territorial con sentido operativo.',
      tags: ['Planificación y Gestión del Territorio', 'Conservación', 'Gestión territorial', 'Ordenamiento']
    },
  };

  const requestedSlug = new URLSearchParams(location.search).get('slug') || 'paisaje-valor-escenico-relacion-territorial';
  const slug = requestedSlug === 'rescate-relocalizacion-especies'
    ? 'ecologia-aplicada-evaluacion-biodiversidad'
    : requestedSlug === 'analisis-cargos-sancionatorios'
      ? 'gestion-estrategica-procedimientos-sma-cumplimiento-ambiental'
      : requestedSlug === 'planes-cumplimiento-ambiental'
        ? 'gestion-estrategica-procedimientos-sma-cumplimiento-ambiental'
    : requestedSlug === 'obras-conservacion-suelo-agua'
      ? 'evaluacion-suelo-procesos-erosivos-restauracion-funcional'
      : requestedSlug === 'permisos-ambientales-sectoriales'
        ? 'estrategia-regulatoria-gestion-riesgo-ambiental'
        : requestedSlug === 'tramitacion-sectorial-conaf-sag'
          ? 'estrategia-regulatoria-gestion-riesgo-ambiental'
          : requestedSlug === 'compromisos-ambientales-voluntarios'
            ? 'estrategia-regulatoria-gestion-riesgo-ambiental'
            : requestedSlug === 'restauracion-ecologica'
              ? 'restauracion-ecologica-soluciones-basadas-en-naturaleza'
              : requestedSlug === 'proyectos-reforestacion'
                ? 'restauracion-ecologica-soluciones-basadas-en-naturaleza'
                : requestedSlug === 'planificacion-areas-conservacion'
                  ? 'planificacion-conservacion-gestion-territorial'
                  : requestedSlug;
  const defaultServiceHeroImage = 'assets/img/fondo_servicios.jpg';
  const serviceHeroImagePath = `assets/img/servicios/hero/${slug}.jpg`;
  const base = serviceCatalog[slug] || {
    title: slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    summary: 'Detalle técnico del servicio seleccionado.',
    tags: ['Servicios', 'Asesoría técnica'],
    heroImage: serviceHeroImagePath
  };

  const serviceData = slug === 'paisaje-valor-escenico-relacion-territorial'
    ? {
        ...base,
        heroImage: serviceHeroImagePath,
        highlight: 'Desarrollamos estudios especializados para identificar el valor paisajístico y turístico del Área de influencia de un proyecto, evaluando calidad visual, intervisibilidad, atractivos turísticos, patrimonio y flujo de visitantes conforme a las guías oficiales del SEA.',
        description: [
          'Caracterizamos el paisaje y el valor turístico del territorio mediante análisis biofísico, visual y territorial, integrando trabajo de terreno, SIG y criterios regulatorios aplicables al SEIA.',
          'Evaluamos unidades de paisaje, cuencas visuales, calidad visual, atractivos culturales y condiciones de atracción turística, permitiendo determinar potenciales impactos y sustentar técnicamente la evaluación ambiental del proyecto.'
        ],
        deliverables: [
          'Informe de Valor Paisajístico conforme Guía SEA 2019',
          'Informe de Valor Turístico conforme Guía SEA 2017',
          'Delimitación de Área de influencia y análisis de intervisibilidad',
          'Identificación de unidades de paisaje y calidad visual',
          'Catastro de atractivos turísticos y patrimoniales',
          'Cartografía temática y registros fotográficos georreferenciados',
          'Evaluación de impactos y conclusiones técnicas para ingreso al SEIA'
        ],
        methodologies: [
          'Guía de Evaluación de Impacto Ambiental del Valor Paisajístico en el SEIA (SEA, 2019)',
          'Guía de Evaluación de Impacto: Valor Turístico en el SEIA (SEA, 2017)',
          'Análisis de intervisibilidad y cuencas visuales',
          'Caracterización de atributos biofísicos y visuales',
          'Evaluación de valor cultural, patrimonial y turístico',
          'Prospección territorial y análisis SIG'
        ],
        cta: 'Si tu proyecto necesita una línea base de paisaje y turismo robusta, podemos ayudarte a definir el alcance técnico y el nivel de respaldo que exige la autoridad.'
      }
    : slug === 'ecologia-aplicada-evaluacion-biodiversidad'
      ? {
        ...base,
        heroImage: serviceHeroImagePath,
        highlight: 'Integramos líneas base de flora y fauna, evaluación de biodiversidad y rescate y relocalización de especies para respaldar decisiones ambientales y territoriales.',
        description: [
          'Realizamos caracterización ecológica de ecosistemas terrestres mediante levantamiento de información en terreno, análisis biogeográfico y evaluación de componentes de flora, vegetación y fauna silvestre, conforme a metodologías y criterios técnicos del SEA y normativa ambiental vigente.',
          'Elaboramos evaluaciones ambientales orientadas a la evaluación territorial de proyectos, integrando definición de Áreas de influencia, identificación de singularidades, evaluación preliminar de impactos y diseño de medidas asociadas al rescate, manejo y relocalización de especies cuando el proyecto lo requiere.'
        ],
        deliverables: [
          'Informe de Línea Base de Flora y Vegetación',
          'Informe de Línea Base de Fauna Silvestre',
          'Plan de rescate y relocalización de especies',
          'Definición y delimitación de Área de Influencia',
          'Caracterización de hábitats y unidades vegetacionales',
          'Inventario y catastro de flora y fauna',
          'Evaluación de estado de conservación y endemismo',
          'Análisis de singularidades ambientales',
          'Evaluación preliminar de impactos ambientales',
          'Cartografía temática y análisis SIG',
          'Registro fotográfico georreferenciado',
          'Fichas de muestreo y bases de datos de especies',
          'Análisis de susceptibilidad al cambio climático'
        ],
        methodologies: [
          'Guías SEA para descripción de ecosistemas terrestres y Área de influencia',
          'Prospecciones y campañas de terreno especializadas',
          'Muestreo representativo por unidades de hábitat',
          'Transectos y búsqueda dirigida de fauna silvestre',
          'Protocolos de rescate, manejo y relocalización de especies',
          'Caracterización de vegetación mediante unidades homogéneas',
          'Identificación taxonómica y análisis biogeográfico',
          'Evaluación de estado de conservación según RCE y Ley de Caza',
          'Análisis de impactos sobre recursos naturales renovables',
          'Cartografía ambiental y análisis territorial SIG',
          'Evaluación de susceptibilidad al cambio climático'
        ],
        cta: 'Si tu proyecto requiere una línea base robusta de flora y fauna, o medidas de rescate y relocalización de especies, podemos ayudarte a definir el alcance técnico y la estrategia de levantamiento en terreno.'
      }
    : slug === 'evaluacion-suelo-procesos-erosivos-restauracion-funcional'
      ? {
        ...base,
        heroImage: serviceHeroImagePath,
        heroPosition: 'center 32%',
        highlight: 'Desarrollamos evaluaciones de suelo y procesos erosivos para proyectos sometidos al SEIA, identificando aptitud, limitantes y criterios de conservación y restauración funcional.',
        description: [
          'Elaboramos evaluaciones de suelo orientadas a la evaluación ambiental, agronómica y territorial de proyectos públicos y privados.',
          'Nuestros análisis integran prospección en terreno, clasificación taxonómica, evaluación de propiedades físicas y químicas, identificación de procesos erosivos, delimitación de unidades edáficas, diseño de obras de conservación de suelo y agua y definición de medidas de restauración funcional, permitiendo identificar restricciones, aptitud productiva y potenciales afectaciones sobre el recurso suelo.'
        ],
        deliverables: [
          'Memoria edáfica y análisis de procesos erosivos',
          'Clasificación de Capacidad de Uso de Suelo (CUS)',
          'Descripción morfológica de perfiles de suelo',
          'Excavación y análisis de calicatas',
          'Evaluación de propiedades físicas y químicas',
          'Identificación de series y unidades de suelo',
          'Cartografía edafológica y análisis SIG',
          'Diseño de obras de conservación de suelo y agua',
          'Evaluación de limitantes edáficas, susceptibilidad a erosión y aptitud de uso',
          'Propuesta de medidas de restauración funcional',
          'Registro fotográfico georreferenciado',
          'Informes técnicos compatibles con requerimientos SAG y SEIA',
          'Bases de datos y fichas de terreno'
        ],
        methodologies: [
          'Prospección y descripción de perfiles de suelo',
          'Excavación de calicatas georreferenciadas',
          'Análisis físico-químicos de laboratorio',
          'Clasificación CUS según Pauta Rectificada SAG 2016',
          'Caracterización taxonómica y morfológica de suelos',
          'Evaluación de drenaje, profundidad efectiva y pedregosidad',
          'Interpretación de series de suelo y material parental',
          'Revisión bibliográfica especializada (CIREN, Luzio, USDA, FAO)',
          'Cartografía temática y delimitación de unidades homogéneas',
          'Diagnóstico de procesos erosivos y estabilidad superficial',
          'Diseño de obras de conservación de suelo y agua',
          'Identificación de medidas de restauración funcional',
          'Evaluación de restricciones y potencial productivo del suelo'
        ],
        cta: 'Si tu proyecto requiere evaluar suelos, erosión o conservación y restauración funcional, podemos ayudarte a definir el alcance y la estrategia de muestreo.'
      }
    : slug === 'estrategia-regulatoria-gestion-riesgo-ambiental'
      ? {
        ...base,
        heroImage: serviceHeroImagePath,
        highlight: 'Diseñamos estrategias regulatorias que integran permisos, tramitación sectorial y compromisos de cumplimiento para reducir riesgos y ordenar la gestión del proyecto.',
        description: [
          'Estructuramos estrategias regulatorias para proyectos con múltiples frentes normativos, integrando permisos ambientales sectoriales, tramitación ante organismos como CONAF y SAG, y compromisos de cumplimiento ambiental.',
          'El servicio permite anticipar riesgos regulatorios, ordenar la secuencia de gestión, definir responsables y construir una ruta técnica y documental que facilite la aprobación y el seguimiento del proyecto.'
        ],
        deliverables: [
          'Matriz regulatoria y de permisos aplicables',
          'Estrategia de tramitación sectorial',
          'Plan de gestión de compromisos y cumplimiento',
          'Evaluación de riesgos regulatorios',
          'Cronograma de hitos y dependencias',
          'Recomendaciones de mitigación y respuesta técnica',
          'Bases para seguimiento y control del expediente'
        ],
        methodologies: [
          'Revisión normativa y levantamiento de permisos aplicables',
          'Análisis de riesgos regulatorios y críticos del proyecto',
          'Definición de estrategia de tramitación con organismos sectoriales',
          'Diseño de compromisos y seguimiento de cumplimiento',
          'Coordinación técnica con equipos de proyecto y especialistas',
          'Elaboración de cronogramas y matrices de control'
        ],
        cta: 'Si tu proyecto necesita ordenar permisos, tramitación sectorial y cumplimiento ambiental en una sola estrategia, podemos ayudarte a estructurarla.'
      }
    : slug === 'restauracion-ecologica-soluciones-basadas-en-naturaleza'
      ? {
        ...base,
        heroImage: serviceHeroImagePath,
        highlight: 'Diseñamos e implementamos restauración ecológica y soluciones basadas en naturaleza con objetivos verificables, priorización de acciones y seguimiento adaptativo.',
        description: [
          'Integramos diagnóstico ecológico, definición de metas de recuperación, priorización de intervenciones y diseño de medidas de restauración con soluciones basadas en naturaleza para fortalecer cobertura, conectividad y funcionalidad ecosistémica.',
          'El servicio combina planificación, ejecución y seguimiento de medidas como enriquecimiento con especies nativas, control de erosión, manejo de suelos, reforestación, rehabilitación de hábitat y restauración post-intervención, orientadas a recuperar procesos ecológicos y reducir vulnerabilidades territoriales.'
        ],
        deliverables: [
          'Diagnóstico inicial y definición de objetivos de restauración',
          'Plan de restauración ecológica',
          'Estrategia de soluciones basadas en naturaleza',
          'Diseño de medidas de reforestación y enriquecimiento',
          'Lineamientos de control de erosión y recuperación de suelos',
          'Zonificación de manejo y priorización de acciones',
          'Programa de monitoreo y manejo adaptativo',
          'Cartografía temática y registros georreferenciados'
        ],
        methodologies: [
          'Diagnóstico ecológico y territorial',
          'Diseño de medidas de restauración por unidades ambientales',
          'Selección de especies nativas y criterios de conectividad',
          'Definición de soluciones basadas en naturaleza',
          'Planificación de reforestación y enriquecimiento',
          'Evaluación de estabilidad de suelos y control de erosión',
          'Seguimiento adaptativo e indicadores de recuperación',
          'Análisis SIG y priorización espacial de intervenciones'
        ],
        cta: 'Si tu proyecto requiere restauración ecológica o soluciones basadas en naturaleza, podemos ayudarte a definir un alcance técnico integrado y viable.'
      }
    : slug === 'humedales-ecosistemas-sensibles'
      ? {
        ...base,
        heroImage: serviceHeroImagePath,
        highlight: 'Desarrollamos estudios técnicos para identificar y delimitar humedales urbanos mediante evaluación integrada de régimen hidrológico, vegetación hidrófita y suelos hídricos, conforme a la Ley N° 21.202, Decreto 15 y la Guía MMA-ONU Medio Ambiente (2022).',
        description: [
          'Realizamos caracterización y delimitación de humedales urbanos mediante análisis territorial, fotointerpretación histórica, levantamiento de información en terreno y evaluación de criterios hidrológicos, vegetacionales y edáficos.',
          'Integramos SIG, sensores remotos y prospección especializada para sustentar técnicamente procesos de evaluación ambiental, planificación territorial y compatibilidad normativa de proyectos.'
        ],
        deliverables: [
          'Informe técnico de delimitación y caracterización de humedales urbanos',
          'Evaluación de criterios hidrológicos, vegetacionales y edáficos',
          'Fotointerpretación histórica y análisis multitemporal',
          'Cartografía temática y delimitación geoespacial del humedal',
          'Catastro de vegetación hidrófita y unidades vegetacionales',
          'Evaluación de suelos hídricos y régimen hidrológico',
          'Registro fotográfico georreferenciado y fichas de terreno',
          'Análisis normativo y compatibilidad territorial'
        ],
        methodologies: [
          'Ley N° 21.202 sobre Humedales Urbanos',
          'Decreto N° 15/2020 - Reglamento Humedales Urbanos',
          'Guía de Delimitación y Caracterización de Humedales Urbanos de Chile (MMA-ONU, 2022)',
          'Evaluación integrada de hidrología, vegetación hidrófita y suelos hídricos',
          'Fotointerpretación histórica mediante sensores remotos',
          'Muestreo de vegetación bajo método Braun-Blanquet',
          'Prospección edáfica y análisis de indicadores redoximórficos',
          'Delimitación SIG y análisis territorial'
        ],
        cta: 'Si tu proyecto requiere delimitar un humedal urbano con respaldo técnico y normativo, podemos ayudarte a estructurar el estudio y su compatibilidad territorial.'
      }
    : {
        ...base,
        highlight: 'Diseñamos un alcance técnico a la medida del proyecto, su territorio y sus exigencias regulatorias.',
        description: [
          `Este servicio aborda ${base.title.toLowerCase()} desde una mirada técnica, territorial y normativa, buscando entregar antecedentes claros para la toma de decisiones.`,
          `El objetivo es ordenar la información relevante, identificar riesgos y construir un respaldo sólido para el desarrollo y la evaluación del proyecto.`
        ],
        deliverables: [
          'Informe técnico de diagnóstico y alcance.',
          'Cartografía, registros o matrices de apoyo según el tipo de servicio.',
          'Recomendaciones y plan de acción para el siguiente paso del proyecto.'
        ],
        methodologies: [
          'Revisión de antecedentes disponibles y definición de alcance.',
          'Análisis técnico y territorial según la naturaleza del servicio.',
          'Elaboración de informe y recomendaciones de cierre.'
        ],
        cta: 'Si este servicio se ajusta a lo que necesitas, podemos definir un alcance técnico más preciso para tu caso.'
      };

  const currentServiceLabel = serviceData.title;

  function ensureServiceOption(select, value) {
    if (!select || !value) return;
    const existing = [...select.options].find(option => option.value === value);
    if (existing) {
      select.value = value;
      return;
    }

    const option = document.createElement('option');
    option.value = value;
    option.textContent = value;
    option.selected = true;
    select.insertBefore(option, select.querySelector('option[value=""]').nextSibling || select.firstChild);
    select.value = value;
  }

  function openContactModal() {
    if (!contactModal) return;
    if (contactModalLead) {
      contactModalLead.textContent = `Cuéntanos tu necesidad sobre ${currentServiceLabel.toLowerCase()} y te contactaremos de manera directa.`;
    }
    if (modalServiceContext) {
      modalServiceContext.value = currentServiceLabel;
    }
    ensureServiceOption(modalServiceSelect, currentServiceLabel);
    contactModal.classList.add('show');
    contactModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  }

  function closeContactModal() {
    if (!contactModal) return;
    contactModal.classList.remove('show');
    contactModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  }

  openContactButtons.forEach(button => button.addEventListener('click', openContactModal));
  closeContactButtons.forEach(button => button.addEventListener('click', closeContactModal));

  window.addEventListener('keydown', event => {
    if (event.key === 'Escape' && contactModal.classList.contains('show')) {
      closeContactModal();
    }
  });

  if (serviceMetaDescription) {
    const serviceTagsList = Array.isArray(serviceData.tags) ? serviceData.tags.filter(Boolean) : [];
    const serviceKeywords = serviceTagsList.join(', ');
    const serviceTitleTags = serviceTagsList.slice(0, 3).join(' | ');

    serviceMetaDescription.setAttribute(
      'content',
      `${serviceData.summary}${serviceKeywords ? ` | ${serviceKeywords}` : ''}`
    );

    document.title = `${serviceData.title}${serviceTitleTags ? ` | ${serviceTitleTags}` : ''} - LBC Consultores Ambientales`;

    const serviceJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: serviceData.title,
      serviceType: serviceTagsList[0] || serviceData.title,
      description: serviceData.summary,
      keywords: serviceKeywords,
      url: location.href.split('#')[0],
      provider: {
        '@type': 'Organization',
        name: 'LBC Consultores Ambientales',
        url: 'https://lbconservation.org'
      }
    };

    let jsonLdScript = document.getElementById('service-jsonld');
    if (!jsonLdScript) {
      jsonLdScript = document.createElement('script');
      jsonLdScript.type = 'application/ld+json';
      jsonLdScript.id = 'service-jsonld';
      document.head.appendChild(jsonLdScript);
    }
    jsonLdScript.textContent = JSON.stringify(serviceJsonLd);
  }

  const serviceHeroBg = document.querySelector('.service-hero-bg');
  if (serviceHeroBg && serviceData.heroImage) {
    const heroImageProbe = new Image();
    heroImageProbe.onload = () => {
      serviceHeroBg.style.backgroundImage = `url("${serviceData.heroImage}")`;
      serviceHeroBg.style.backgroundPosition = serviceData.heroPosition || 'center center';
    };
    heroImageProbe.onerror = () => {
      serviceHeroBg.style.backgroundImage = `url("${defaultServiceHeroImage}")`;
      serviceHeroBg.style.backgroundPosition = 'center center';
    };
    heroImageProbe.src = serviceData.heroImage;
  }

  if (serviceHero && serviceHeroBg) {
    let ticking = false;

    const updateHeroParallax = () => {
      const scrollY = window.scrollY || 0;
      const offset = Math.min(scrollY * 0.16, 48);
      serviceHeroBg.style.transform = `translateY(${offset}px) scale(1.06)`;
      ticking = false;
    };

    const requestUpdate = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateHeroParallax);
    };

    updateHeroParallax();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate, { passive: true });
  }

  if (serviceTags) {
    const tags = Array.isArray(serviceData.tags) ? serviceData.tags : [];
    serviceTags.innerHTML = tags.length
      ? tags.map(tag => `<span class="service-pill">${tag}</span>`).join('')
      : '<span class="service-pill">Servicio</span>';
  }
  if (serviceTitle) serviceTitle.textContent = serviceData.title;
  if (serviceSummary) serviceSummary.textContent = serviceData.summary;
  if (serviceHighlight) serviceHighlight.textContent = serviceData.highlight;
  if (serviceCtaText) serviceCtaText.textContent = serviceData.cta;

  function renderParagraphs(container, paragraphs) {
    if (!container) return;
    container.innerHTML = '';
    paragraphs.forEach(text => {
      const p = document.createElement('p');
      p.textContent = text;
      container.appendChild(p);
    });
  }

  function renderList(container, items) {
    if (!container) return;
    container.innerHTML = '';
    items.forEach(text => {
      const li = document.createElement('li');
      li.textContent = text;
      container.appendChild(li);
    });
  }

  renderParagraphs(serviceDescription, serviceData.description);
  renderList(serviceDeliverables, serviceData.deliverables);
  renderList(serviceMethodologies, serviceData.methodologies);

  document.body.classList.remove('service-loading');
  document.body.classList.add('service-ready');
})();

/* =========================================================
   FUNCIONALIDAD DE PRELOADER CON ANIMACIÓN DE LOGO
   ========================================================= */
const preloader = document.querySelector('.preloader');
const logo = document.querySelector('.preloader-logo');
const content = document.getElementById('website-content');
const body = document.body;

function isInternalReferrer() {
    if (!document.referrer) return false;
    try {
        return new URL(document.referrer).origin === location.origin;
    } catch {
        return false;
    }
}

function finishPreloader(skipAnimation = false) {
    if (!preloader || !content) return;

    if (skipAnimation) {
        preloader.style.display = 'none';
        preloader.style.opacity = '0';
        body.classList.remove('preloader-active');
        window.scrollTo(0, 0);
        return;
    }

    preloader.style.opacity = '0';
    preloader.addEventListener('transitionend', function() {
        preloader.style.display = 'none';
        body.classList.remove('preloader-active');
        window.scrollTo(0, 0);
        history.replaceState(null, '', ' ');
    }, { once: true });
}

window.addEventListener('load', function() {
    if (!preloader || !logo || !content) return;

    if (isInternalReferrer()) {
        finishPreloader(true);
        return;
    }

    // 1. Animación de Entrada del logo
    logo.style.animation = 'logoFadeIn 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards';

    // 2. Espera 2 segundos y luego inicia la animación de salida del logo y el preloader
    setTimeout(function() {
        // Animación de Salida del logo
        logo.style.animation = 'logoPureFadeOut 0.8s ease-out forwards';

        // Oculta el preloader completo después de un breve retraso
        setTimeout(function() {
            finishPreloader(false);
        }, 800); // Espera 0.8s para que el logo se desvanezca
    }, 2000); // Muestra el logo por 2s
});


