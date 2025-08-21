# Sitio estático LBC — listo para GitHub + Netlify

Este paquete contiene una **versión multi‑página** (HTML/CSS/JS) sin dependencias ni build.

## Estructura
```
.
├── index.html
├── nosotros.html
├── servicios.html
├── proyectos.html
├── publicaciones.html
├── contacto.html
└── assets/
    ├── site.css
    ├── site.js
    └── favicon.png
```

## Publicación en GitHub Pages (opcional)
1. Crea un repositorio nuevo (p. ej., `lbc-site`).
2. Sube todos los archivos de este zip a la **raíz** del repo.
3. Activa **GitHub Pages** en `Settings → Pages` y elige **Branch: main** y **/ (root)** como carpeta. Guarda.
4. La URL quedará como `https://TU_USUARIO.github.io/lbc-site/`.

## Publicación en Netlify (recomendado)
1. En Netlify, elige **Add new site → Import from Git**.
2. Conecta tu cuenta de GitHub y selecciona el repo subido.
3. **Build command:** *(dejar vacío)* — no necesita build.
4. **Publish directory:** `/` (la raíz).
5. Deploy.

> Si usas un subdirectorio, asegúrate de que `Publish directory` apunte a ese subdirectorio.

## Personalización
- Reemplaza imágenes `dummyimage.com` por logos/partners reales.
- Cambia el `favicon.png` en `assets/` si lo deseas.
- En `assets/site.js` puedes sustituir el envío simulado del formulario por tu endpoint real (Netlify Forms, Airtable, SheetDB, etc.).
