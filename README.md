# Pulppo · Formatos legales (GitHub Pages)

Sitio estático para compartir formatos legales inmobiliarios y generar leads para asesoría jurídica.

## Tecnologías
- HTML5 + CSS3 + JavaScript (vanilla)
- Sin backend. Descarga gated por email usando `localStorage`.
- Carrusel responsive con soporte touch y teclado.

## Estructura
```
.
├── index.html
├── styles.css
├── app.js
├── docs.json               # Inventario de documentos (título, ruta PDF, ruta preview)
└── assets
    ├── pulppo-logo.png
    ├── pdfs/               # PDFs originales
    └── previews/           # Previsualizaciones (PNG de pág. 1)
```

## Cómo desplegar en GitHub Pages
1. Crea un repositorio nuevo (por ejemplo, `pulppo-formats`).
2. Sube **todo** el contenido de esta carpeta al repositorio (mantén la estructura).
3. En GitHub, ve a **Settings → Pages**.
4. En **Build and deployment**, selecciona:
   - **Source:** Deploy from a branch
   - **Branch:** `main` y carpeta `/ (root)`
5. Guarda. La página quedará disponible en `https://<tu-usuario>.github.io/<repo>/` en 1–2 minutos.

> **Tip:** si usas otra rama (e.g. `docs`), asegúrate de que `index.html` esté en la raíz de esa rama.

## Añadir o actualizar documentos
1. Copia el PDF en `assets/pdfs/`.
2. Genera una imagen PNG de la primera página y guárdala en `assets/previews/` con el mismo nombre del PDF, pero `.png`.
3. Edita `docs.json` y agrega un objeto con:
```json
{
  "title": "Tu título",
  "pdf": "assets/pdfs/archivo.pdf",
  "preview": "assets/previews/archivo.png"
}
```
4. Haz commit y push. No necesitas cambiar el HTML.

## Estilo
- Tipografías: Montserrat y Open Sans.
- Paleta: azul Pulppo (`#0a67ff`) con acentos naranja.
- Animaciones sutiles en hover y carrusel.

## Privacidad
- El email se guarda **solo en el navegador** (localStorage) para evitar solicitarlo de nuevo. No hay envío a servidor.
- Si deseas almacenar correos, integra un servicio (e.g. form backend) y modifica `app.js` para hacer `fetch` al endpoint deseado.

## Licencia
© Pulppo. Uso interno.
