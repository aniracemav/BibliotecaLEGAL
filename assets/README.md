# BibliotecaLEGAL · Paquete de integración (Download Gate)

Este paquete contiene:
- `assets/download-gate.js` — Interceptor de descargas + modal + POST a Apps Script
- `aviso-de-privacidad.html` — Página base de Aviso de Privacidad (v1.0)
- `index-snippet.html` — Snippet para incluir el script y ejemplo de enlace

## Config aplicada
- **ENDPOINT** ya configurado: `https://script.google.com/macros/s/AKfycbyFHt78xebhiS06_ZXOrV3U9bZo5-BB9F9-J5fiCRTdNsmPcXebepBhsZsbdDY7W7XD/exec`

## Pasos:

1. **Copia archivos** a tu repo:
   - Sube `assets/download-gate.js` a la carpeta `assets/` (en raíz).
   - Sube `aviso-de-privacidad.html` a la raíz del sitio.
   - (Opcional) Revisa `index-snippet.html` como referencia.

2. **Incluye el script** en tu `index.html` (antes de `</body>`):
   ```html
   <script src="assets/download-gate.js"></script>
   ```

3. **Etiqueta** tus enlaces a documentos o confía en la detección por extensión.
   Ejemplo:
   ```html
   <a href="/docs/mx_promesa_cv_001.docx" data-download>Descargar formato</a>
   ```

4. **Despliega** en GitHub Pages y prueba. El archivo debe descargarse y el registro
   debe aparecer en tu Google Sheet (timestamp, email, pdf, ua).

> Nota legal: ajusta `aviso-de-privacidad.html` con los datos de tu empresa y correo de contacto.
