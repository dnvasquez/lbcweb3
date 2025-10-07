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

  const dateElement = document.getElementById('kpi-update-date');
  // Mostrar un mensaje de carga o por defecto inmediatamente
  if (dateElement) {
    dateElement.textContent = 'Cargando datos...';
  }

  // URL del archivo CSV de tu pestaña "KPIS"
  const sheetURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR-biUPUV4w-Ran2m80Wm5gw-d-IfxzvKdbq-D--OE5-8qVp4QY5C_gbcgAz5hk7yAfOKdBnpXVoNmY/pub?gid=1006059514&single=true&output=csv';

  fetch(sheetURL)
    .then(response => response.text())
    .then(csvText => {
      const rows = csvText.split('\n');
      // Apunta a la fila 1000 (índice 999)
      const kpiValues = rows[999].split(',');

      // 1. Extrae la fecha de la segunda columna (índice 1)
      const updateDate = kpiValues[1];

      // 2. Inserta el texto con la fecha en el párrafo
      if (dateElement && updateDate) {
        // Usa una comprobación simple para asegurar que la fecha no está vacía
        if (updateDate.trim() !== '') {
            dateElement.textContent = `KPI´s actualizados a ${updateDate}`;
        } else {
            // Si la columna de fecha está vacía, muestra un mensaje estándar
            dateElement.textContent = 'KPI´s actualizados recientemente.';
        }
      }

      const els = kpiSection.querySelectorAll('[data-kpi]');
      if (!els.length) return;

      const dur = 900;

      // MODIFICACIÓN: La función animate ahora acepta prefijo y sufijo
      function animate(el, target, prefix = '', suffix = '') {
        const t0 = performance.now();
        (function tick(now) {
          const p = Math.min(1, (now - t0) / dur);
          const currentValue = Math.floor(0 + (target - 0) * (0.5 - Math.cos(Math.PI * p) / 2));
          // MODIFICACIÓN: Aplica prefijo y sufijo al contenido del elemento
          el.textContent = prefix + currentValue + suffix;
          if (p < 1) requestAnimationFrame(tick);
        })(t0);
      }

      const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting && !e.target.dataset.done) {
            e.target.dataset.done = 1;
            const kpiIndex = parseInt(e.target.getAttribute('data-kpi'), 10);
            const targetValue = parseInt(kpiValues[kpiIndex + 2], 10);
            
            let prefix = '';
            let suffix = '';
            
            // MODIFICACIÓN: Añade prefijo y sufijo para el KPI de Árboles plantados (index 4)
            if (kpiIndex === 4) {
              prefix = '>';
              suffix = 'k';
            }

          // MODIFICACIÓN: Añade prefijo para el KPI de Años (index 0)
            if (kpiIndex === 0) {
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
            title: 'Valor Paisajístico y Turístico',
            subtitle: 'Determinación del Valor Paisajístico y Turístico en Proyectos Inmobiliarios',
            image: 'assets/img/proyecto2.jpg',
            description: 'Desarrollamos una metodología que integra análisis SIG y evaluación de percepción para determinar el valor escénico de un predio inmobiliario en Pucón. El estudio permitió identificar las zonas con mayor potencial paisajístico para el desarrollo de proyectos turísticos sostenibles, resguardando las áreas de alto valor natural y minimizando el impacto visual en el entorno. Este enfoque ayudó al cliente a tomar decisiones estratégicas de planificación que optimizan la rentabilidad del proyecto mientras se conserva la belleza natural del lugar.',
            link: '#'
        },
        delhum: {
            title: 'Delimitación de Humedales Urbanos',
            subtitle: 'Cumplimiento de la Ley N°21.202',
            image: 'assets/img/proyecto3.jpg',
            description: 'En el marco de la Ley N°21.202 de Delimitación de Humedales Urbanos, desarrollamos un estudio especializado de delimitación y caracterización de humedales urbanos en un área de 1,5 hectáreas ubicada en la comuna de Valdivia, Región de Los Ríos. El proyecto aplicó la metodología establecida por el Reglamento de la Ley N° 21.202 y la Guía de Delimitación y Caracterización de Humedales Urbanos de Chile, evaluando tres criterios técnicos fundamentales: presencia de vegetación hidrófila, suelos hídricos y régimen hidrológico de saturación. A través de 17 calicatas de suelo, 10 parcelas de muestreo florístico y 17 puntos de evaluación hidrológica, se identificaron 31 especies vegetales (29% nativas), 8 especies hidrófilas y 4 unidades vegetacionales diferenciadas. El estudio determinó que 0,85 hectáreas del área cumplen con los criterios de humedal urbano, estableciendo una delimitación técnica precisa mediante superposición cartográfica aditiva de los tres criterios evaluados. El trabajo constituye un modelo metodológico riguroso para la identificación y protección de humedales urbanos en contextos periurbanos del sur de Chile.',
            link: '#'
        },
        municipalidad: {
            title: 'Estrategia de retención hídrica',
            subtitle: 'SbN para la gestión hídrica',
            image: 'assets/img/proyecto4.jpg',
            description: 'En el marco de la crisis hídrica que enfrenta la Región Metropolitana, como equipo consultor desarrollamos una propuesta integral de diseño de estrategia de retención hídrica en las 5.400 hectáreas administradas por la Asociación Parque Cordillera en la precordillera de la Región Metropolitana de Chile. Estructuramos el proyecto como un estudio multidisciplinario que combinó análisis técnico-científico con validación social participativa, aplicando metodologías de revisión bibliográfica de experiencias nacionales e internacionales, análisis multicriterio para zonificación territorial, y entrevistas semi-estructuradas a expertos en restauración ecológica, hidrología y planificación territorial. Integramos especialistas en soluciones basadas en la naturaleza, geomática y sistemas de información geográfica, componente social y gobernanza territorial, arquitectura paisajística y coordinación general de proyectos ambientales. Nuestro objetivo fue posicionar a la precordillera de Santiago como un espacio resiliente frente al cambio climático, donde las Soluciones basadas en la Naturaleza permitan restaurar y conservar la funcionalidad hídrica del ecosistema, estableciendo a APC como referente en gestión hídrica y educación ambiental a escala metropolitana. Diseñamos el proyecto incluyendo cinco ejes estratégicos complementarios que abarcan desde investigación aplicada hasta articulación de actores territoriales.',
            link: '#'
        },
        saneamientoambiental: {
            title: 'Plan de restauración ecológica',
            subtitle: 'Evaluación, diseño y ejecución',
            image: 'assets/img/proyecto5.jpg',
            description: 'En el marco del seguimiento ambiental post-cierre de un Relleno Sanitario, desarrollamos para Veolia un estudio especializado de actualización del Plan de Restauración en un área de 27,2 hectáreas ubicada en el sector poniente de la Región Metropolitana. El proyecto aplicó los estándares internacionales de la Sociedad para la Restauración Ecológica (SER), utilizando el sistema de estrellas para evaluar brechas entre el estado actual del ecosistema y un modelo de referencia basado en el Santuario Quebrada de La Plata. A través de caracterización de seis unidades vegetacionales, identificación de 59 especies de flora vascular terrestre y 32 especies de vertebrados, se determinaron factores limitantes prioritarios como incendios forestales, ausencia de fuentes de propágulos y herbivoría por lagomorfos. El estudio estableció una zonificación diferenciada según intensidad de manejo y estrategias específicas de restauración activa, incluyendo enriquecimiento con especies nativas, construcción de OCAS, exclusión de ganado y control de lagomorfos. El plan operativo de 10 años integra un enfoque de manejo adaptativo con metas cuantificables para 2036, asegurando el cumplimiento de los compromisos ambientales establecidos en la RCA.',
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

        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    projectCards.forEach(card => {
        card.addEventListener('click', (e) => {
            const projectKey = card.dataset.project;
            if (projectKey) {
                openModal(projectKey);
            }
        });
    });

    closeBtn.addEventListener('click', closeModal);

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
})();

/* =========================================================
   FUNCIONALIDAD DE PRELOADER CON ANIMACIÓN DE LOGO
   ========================================================= */
const preloader = document.querySelector('.preloader');
const logo = document.querySelector('.preloader-logo');
const content = document.getElementById('website-content');
const body = document.body;

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
                body.classList.remove('preloader-active'); // Elimina la clase de precarga
                window.scrollTo(0, 0); // Vuelve a llevar la página al inicio
                history.replaceState(null, '', ' '); // Elimina el ancla de la URL
            }, { once: true });
        }, 800); // Espera 0.8s para que el logo se desvanezca
    }, 2000); // Muestra el logo por 2s
});
