// Helpers
const $ = (q, ctx = document) => ctx.querySelector(q);
const $$ = (q, ctx = document) => [...ctx.querySelectorAll(q)];

// Año dinámico en el footer
const yearSpan = document.getElementById('y');
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// Toggle menú móvil
const btn = $('#menuBtn'),
  menu = $('#menu');
btn?.addEventListener('click', () => {
  menu.classList.toggle('show');
  btn.setAttribute('aria-expanded', menu.classList.contains('show') ? 'true' : 'false');
});

// Activa enlace de navegación según la sección visible (para One Page)
function markActiveOnScroll() {
  const sections = $$('section[id]');
  const navLinks = $$('.menu a');
  addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (pageYOffset >= sectionTop - 65) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(a => {
      a.classList.remove('active');
      if (a.getAttribute('href').substring(1) === current) {
        a.classList.add('active');
      }
    });
  }, { passive: true });
}

// Llama a la función si estamos en la página principal
if (location.pathname.endsWith('/') || location.pathname.endsWith('index.html')) {
  markActiveOnScroll();
} else {
  (function markActive() {
    const path = location.pathname.split('/').pop() || 'index.html';
    $$('.menu a').forEach(a => {
      const href = a.getAttribute('href');
      if (!href) return;
      const cleanHref = href.includes('#') ? href.split('#')[0] : href;
      if (cleanHref === '' && path === 'index.html') a.classList.add('active');
      if (cleanHref === path) a.classList.add('active');
    });
  })();
}

// Envío simulado de formularios
function submitLead(form, statusId = 'leadStatus') {
  const status = document.getElementById(statusId);
  if (status) { status.textContent = 'Enviando…'; }
  setTimeout(() => {
    if (status) { status.style.color = 'var(--brand)'; status.textContent = '¡Gracias! Te contactaremos muy pronto.'; }
    form.reset();
  }, 700);
}
window.submitLead = submitLead;

// Contadores de KPIs
(function() {
  const kpiSection = document.getElementById('kpis');
  if (!kpiSection) return;
  const els = kpiSection.querySelectorAll('[data-count]');
  if (!els.length) return;
  const dur = 900;
  function animate(el) {
    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
    const t0 = performance.now();
    (function tick(now) {
      const p = Math.min(1, (now - t0) / dur);
      el.textContent = Math.floor(0 + (target - 0) * (0.5 - Math.cos(Math.PI * p) / 2));
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting && !e.target.dataset.done) {
        e.target.dataset.done = 1;
        animate(e.target);
      }
    });
  }, { threshold: 0.4 });
  els.forEach(el => io.observe(el));
})();

// Control del Header en Scroll
(function() {
  const nav = document.querySelector('header.nav');
  if (!nav) return;
  const handleScroll = () => {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
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
   FUNCIONALIDAD PARA MODAL DE PROYECTOS
   ========================================================= */
(function() {
    const modal = document.getElementById('projectModal');
    const closeBtn = $('.close-btn');
    const projectCards = $$('.project-card');

    // Datos de los proyectos
    const projectData = {
        agricultura: {
  title: 'Plan de Fomento y Conservación de la Biodiversidad',
  subtitle: 'Auditoría y Planes de Conservación en Predios Agrícolas',
  image: 'assets/img/proyecto1.jpg',
  description: 'En el contexto de auditoría de la norma LEAF 16.1, se desarrolló un levantamiento integral de flora, fauna y condición biológica de suelos en cinco predios agrícolas de las regiones Metropolitana y de Coquimbo, con superficies que van desde 80 hasta más de 1.000 hectáreas. El proyecto incluyó la identificación de formaciones vegetacionales, el registro de especies nativas y endémicas, y la evaluación de la calidad del suelo. Con base en esta información se elaboraron planes de mejora y conservación para cada predio, que contemplan capacitación, monitoreo de especies clave y acciones de restauración ecológica. El trabajo constituye un modelo replicable para armonizar la producción agrícola con la conservación del paisaje y la biodiversidad en distintas escalas territoriales.',
  link: '#'
},
        paitur: {
            title: 'Paisaje y Turismo',
            subtitle: 'Determinación del Valor Paisajístico y Turístico',
            image: 'assets/img/proyecto2.jpg',
            description: 'Creación de modelos espaciales multicriterio para identificar las zonas óptimas para proyectos de restauración. Se integraron variables como la calidad del suelo, la cobertura vegetal, la distancia a fuentes de agua y la conectividad del paisaje para generar mapas estratégicos que maximizan el retorno de la inversión en conservación.',
            link: '#'
        },
      
        delhum: {
            title: 'Delimitación de Humedales Urbanos',
            subtitle: 'Cumplimiento de la Ley N°21.202',
            image: 'assets/img/proyecto3.jpg',
            description: 'En el marco de la Ley N°21.202 de Delimitación de Humedales Urbanos, desarrollamos un estudio especializado de delimitación y caracterización de humedales urbanos en un área de 1,5 hectáreas ubicada en la comuna de Valdivia, Región de Los Ríos. El proyecto aplicó la metodología establecida por el Reglamento de la Ley N° 21.202 y la Guía de Delimitación y Caracterización de Humedales Urbanos de Chile, evaluando tres criterios técnicos fundamentales: presencia de vegetación hidrófila, suelos hídricos y régimen hidrológico de saturación. A través de 17 calicatas de suelo, 10 parcelas de muestreo florístico y 17 puntos de evaluación hidrológica, se identificaron 31 especies vegetales (29% nativas), 8 especies hidrófilas y 4 unidades vegetacionales diferenciadas. El estudio determinó que 0,85 hectáreas del área cumplen con los criterios de humedal urbano, estableciendo una delimitación técnica precisa mediante superposición cartográfica aditiva de los tres criterios evaluados. El trabajo constituye un modelo metodológico riguroso para la identificación y protección de humedales urbanos en contextos periurbanos del sur de Chile.',
            link: '#'
        }
    };

    function openModal(projectKey) {
        const data = projectData[projectKey];
        if (!data) return;

        $('#modalTitle').textContent = data.title;
        $('#modalSubtitle').textContent = data.subtitle;
        $('#modalImage').src = data.image;
        $('#modalDescription').textContent = data.description;

        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Evita el scroll del fondo
    }

    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = ''; // Habilita el scroll del fondo
    }

    // Escuchar clics en las fichas de proyectos
    projectCards.forEach(card => {
        card.addEventListener('click', (e) => {
            const projectKey = card.dataset.project;
            if (projectKey) {
                openModal(projectKey);
            }
        });
    });

    // Escuchar clic en el botón de cierre
    closeBtn.addEventListener('click', closeModal);

    // Cerrar si el usuario hace clic fuera del modal
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

})();
