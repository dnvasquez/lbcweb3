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
const navLogo = $('#nav-logo');
if (nav) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
      if (navLogo) {
        navLogo.src = 'assets/logos/logolbcchoco.png';
      }
    } else {
      nav.classList.remove('scrolled');
      if (navLogo) {
        navLogo.src = 'assets/logos/logolbcblanco.png';
      }
    }
  }, { passive: true });
}

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

// Envío de formularios con Netlify
// Handles Netlify form submission via AJAX
const netlifyForm = document.querySelector('form[data-netlify="true"]');

if (netlifyForm) {
  netlifyForm.addEventListener('submit', event => {
    event.preventDefault(); // Prevents the default form submission

    const statusMessage = document.getElementById('leadStatusHome');
    const formData = new FormData(netlifyForm);
    
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
        statusMessage.style.color = 'var(--brand-teal)'; // Success color
      }
      netlifyForm.reset(); // Clears the form fields
    })
    .catch(error => {
      if (statusMessage) {
        statusMessage.textContent = 'Error al enviar el formulario.';
        statusMessage.style.color = 'red'; // Error color
      }
      console.error(error);
    });
  });
}

// Contadores de KPIs desde Google Sheets (versión ajustada)
(function() {
  const kpiSection = document.getElementById('kpis');
  if (!kpiSection) return;

  // URL del archivo CSV de tu pestaña "KPIS"
  const sheetURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR-biUPUV4w-Ran2m80Wm5gw-d-IfxzvKdbq-D--OE5-8qVp4QY5C_gbcgAz5hk7yAfOKdBnpXVoNmY/pub?gid=1006059514&single=true&output=csv';

  fetch(sheetURL)
    .then(response => response.text())
    .then(csvText => {
      const rows = csvText.split('\n');
      // Apunta a la fila 1000 (índice 999)
      const kpiValues = rows[999].split(',');

      // --- INICIO DE LA MODIFICACIÓN ---

      // 1. Extrae la fecha de la segunda columna (índice 1)
      const updateDate = kpiValues[1];
      const dateElement = document.getElementById('kpi-update-date');

      // 2. Inserta el texto con la fecha en el párrafo
      if (dateElement && updateDate) {
        dateElement.textContent = `KPI´s actualizados a ${updateDate}`;
      }

      // --- FIN DE LA MODIFICACIÓN ---

      const els = kpiSection.querySelectorAll('[data-kpi]');
      if (!els.length) return;

      const dur = 900;

      function animate(el, target) {
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
            const kpiIndex = parseInt(e.target.getAttribute('data-kpi'), 10);
            const targetValue = parseInt(kpiValues[kpiIndex + 2], 10);
            animate(e.target, targetValue);
          }
        });
      }, { threshold: 0.4 });

      els.forEach(el => io.observe(el));
    })
    .catch(error => {
      console.error('Error al cargar los datos de KPIs:', error);
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

// =========================================================
// JavaScript para el Modal de Proyectos
// =========================================================

document.addEventListener('DOMContentLoaded', function() {
    // Elementos del modal
    const modal = document.getElementById('projectModal');
    const closeBtn = modal.querySelector('.close-btn');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalSubtitle = document.getElementById('modalSubtitle');
    const modalDescription = document.getElementById('modalDescription');

    // Función para abrir el modal
    function openModal(projectData) {
        // Llenar el contenido del modal
        modalImage.src = projectData.image || '';
        modalImage.alt = projectData.title || 'Imagen del proyecto';
        modalTitle.textContent = projectData.title || '';
        modalSubtitle.textContent = projectData.subtitle || '';
        modalDescription.innerHTML = projectData.description || '';

        // Mostrar el modal
        modal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevenir scroll del body
        
        // Focus en el modal para accesibilidad
        modal.focus();
    }

    // Función para cerrar el modal
    function closeModal() {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto'; // Restaurar scroll del body
        
        // Limpiar contenido después de la animación
        setTimeout(() => {
            modalImage.src = '';
            modalTitle.textContent = '';
            modalSubtitle.textContent = '';
            modalDescription.innerHTML = '';
        }, 300);
    }

    // Event listeners para cerrar el modal
    closeBtn.addEventListener('click', closeModal);

    // Cerrar al hacer click fuera del modal
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Cerrar con la tecla Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });

    // Función para configurar los triggers de los proyectos
    function setupProjectTriggers() {
        // Ejemplo de cómo conectar con tus elementos de proyecto
        // Reemplaza '.project-item' con la clase real de tus elementos
        const projectItems = document.querySelectorAll('.project-item, .proyecto, [data-project]');
        
        projectItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Obtener datos del proyecto desde atributos data- o contenido del elemento
                const projectData = {
                    title: this.dataset.title || this.querySelector('h3, .title')?.textContent || '',
                    subtitle: this.dataset.subtitle || this.querySelector('.subtitle')?.textContent || '',
                    description: this.dataset.description || this.querySelector('.description')?.innerHTML || '',
                    image: this.dataset.image || this.querySelector('img')?.src || ''
                };
                
                openModal(projectData);
            });
        });
    }

    // Inicializar los triggers cuando el DOM esté listo
    setupProjectTriggers();

    // Función global para abrir modal (puedes usarla desde HTML con onclick)
    window.openProjectModal = function(title, subtitle, description, image) {
        const projectData = {
            title: title,
            subtitle: subtitle,
            description: description,
            image: image
        };
        openModal(projectData);
    };

    // Función global para cerrar modal
    window.closeProjectModal = closeModal;
});

})();

/* =========================================================
   FUNCIONALIDAD DE PRELOADER CON ANIMACIÓN DE LOGO
   ========================================================= */
const preloader = document.querySelector('.preloader');
const logo = document.querySelector('.preloader-logo');
const content = document.getElementById('content'); // Asumiendo que el contenido principal está en un elemento con ID 'content'

window.addEventListener('load', function() {
    // 1. Animación de Entrada del logo
    logo.style.animation = 'logoFadeIn 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards';

    // 2. Espera 2 segundos y luego inicia la animación de salida del logo y el preloader
    setTimeout(function() {
        // Animación de Salida del logo
        logo.style.animation = 'logoPureFadeOut 0.8s ease-out forwards';

        // Oculta el preloader completo después de un breve retraso
        setTimeout(function() {
            preloader.style.opacity = '0';
            preloader.addEventListener('transitionend', function() {
                preloader.style.display = 'none';
                if (content) {
                    content.style.display = 'block'; // Muestra el contenido principal
                }
            }, { once: true });
        }, 800); // Espera 0.8s para que el logo se desvanezca
    }, 2000); // Muestra el logo por 2s
});


// Fade-in effect on scroll
const aosObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('[data-aos]').forEach(element => {
    aosObserver.observe(element);
});
