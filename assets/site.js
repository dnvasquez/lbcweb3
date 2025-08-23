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
        fauna: {
            title: 'Monitoreo de fauna',
            subtitle: 'Conectividad ecológica en áreas de interfaz',
            image: 'https://dummyimage.com/800x600/11261f/9fb8ad&text=Monitoreo+Fauna+Detalle',
            description: 'Diseño y ejecución de monitoreos con cámaras trampa, transectos y análisis de hábitat. Este proyecto se enfocó en evaluar la conectividad en zonas de transición entre áreas protegidas y zonas productivas, proporcionando recomendaciones para la gestión y mitigación de impactos. La información recolectada es crucial para la conservación de especies clave.',
            link: '#'
        },
        zonificacion: {
            title: 'Zonificación SIG',
            subtitle: 'Priorización de corredores de biodiversidad',
            image: 'https://dummyimage.com/800x600/11261f/9fb8ad&text=Zonificaci%C3%B3n+SIG+Detalle',
            description: 'Creación de modelos espaciales multicriterio para identificar las zonas óptimas para proyectos de restauración. Se integraron variables como la calidad del suelo, la cobertura vegetal, la distancia a fuentes de agua y la conectividad del paisaje para generar mapas estratégicos que maximizan el retorno de la inversión en conservación.',
            link: '#'
        },
        cumplimiento: {
            title: 'Cumplimiento Ambiental',
            subtitle: 'Trazabilidad y preparación para auditorías',
            image: 'https://dummyimage.com/800x600/11261f/9fb8ad&text=Cumplimiento+Ambiental+Detalle',
            description: 'Desarrollo de un plan de gestión y un tablero de indicadores para simplificar los procesos de trazabilidad y reportabilidad ambiental. Esta solución digital permite a las empresas prepararse de manera proactiva para las auditorías, asegurando el cumplimiento normativo y mejorando la transparencia de sus operaciones.',
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
        $('#modalLink').href = data.link;

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
