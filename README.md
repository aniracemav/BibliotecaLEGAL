# Pulppo · Formatos legales (GitHub Pages)

Versión final con:
- Modal de email **obligatorio** (sin bypass).
- Registro en Google Sheets vía Apps Script (endpoint ya configurado).
- Carrusel responsive y CTA de agenda.

## Despliegue
1. Sube todo el contenido a tu repo (rama `main`, raíz).
2. En Settings → Pages, selecciona Deploy from a branch → `main` / `(root)`.
3. Listo en 1–2 min.

## Reset rápido del email
Agrega `?resetEmail=1` a la URL para limpiar el correo guardado en `localStorage`.

## Cambiar el endpoint de Sheets
- Edita `index.html` o `app.js` y reemplaza la URL de `window.GS_ENDPOINT`/`GS_ENDPOINT`.
