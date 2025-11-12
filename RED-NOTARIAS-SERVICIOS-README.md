# Cambios agregados — BibliotecaLEGAL

## Nuevas páginas
- `red-notarias.html`: Directorio **RED NOTARÍAS | PULPPO** con HLOM (CDMX), Notaría 5 y 176 (CDMX) y Notaría 159 (EdoMex).
- `servicios-legales.html`: Tabla de precios y CTA de servicios legales para comunidad Pulppo.

## Recursos
- Imágenes en `assets/images/red_notarias/` (`hlom.png`, `notaria176.png`, `notaria159.png`).
- Script de tracking: `assets/js/pulppo_events.js`. Auto-envía `type:'visit'` al cargar las páginas y `type:'download'` al hacer clic en elementos con atributo `data-download`. Si no hay email en `data-email`, solicita uno.

## Integración en `index.html`
- Se añadieron dos botones de acceso rápido al final de la página:
  - **RED NOTARÍAS | PULPPO**
  - **Servicios Legales**
  (nav_added = True)

## Endpoint de eventos
- POST `https://api.pulppo.com/legals/events`
  - Visitas: `{ type: 'visit' }`
  - Descargas: `{ type: 'download', email: '<correo>' }`

## Subida a GitHub Pages
- Sustituye el contenido del repositorio por esta carpeta o sube solo los archivos nuevos/actualizados.
