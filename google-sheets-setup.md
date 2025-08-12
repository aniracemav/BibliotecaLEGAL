# Integración con Google Sheets (Apps Script)

Esta guía guarda cada descarga (correo + archivo) en un Google Sheet.

## 1) Crear el Google Sheet
- Crea una hoja de cálculo en Google Drive. Ponle un nombre, por ejemplo: `Pulppo Descargas`.
- En la fila 1 agrega encabezados: `timestamp, email, pdf, userAgent` (en A1:D1).

## 2) Crear el Apps Script
- En el Sheet, ve a **Extensiones → Apps Script**.
- Crea un archivo `Code.gs` y pega el contenido de `google-apps-script/Code.gs` de este repo.
- Reemplaza `SPREADSHEET_ID` por el ID de tu Sheet (lo encuentras en la URL del Sheet).

## 3) Desplegar como Web App
- En Apps Script: **Publicar → Implementar como aplicación web** (o **Deploy → New deployment**).
- Tipo de implementación: **Web app**.
- **Descripción**: `Pulppo Downloads Logging`.
- **Ejecutar como**: Tu cuenta.
- **Quién tiene acceso**: `Cualquiera con el enlace` (o `Anyone`).
- Haz clic en **Implementar** y copia la **URL del Web App**.

## 4) Conectar el front
- En este proyecto, abre `app.js` y reemplaza:
  ```js
  const GS_ENDPOINT = 'YOUR_APPS_SCRIPT_WEB_APP_URL';
  ```
  por la URL que copiaste.
- Opcional: agrega en `index.html` antes de `app.js`:
  ```html
  <script>window.GS_ENDPOINT = 'TU_URL_AQUI';</script>
  ```

## 5) Probar
- Abre el sitio, intenta descargar un PDF, ingresa un email.
- Revisa el Sheet: debería crearse una nueva fila con los datos.

## Seguridad y notas
- Este sitio es estático. La validación de email es básica.
- Si quieres validar dominios específicos o aplicar rate limit, hazlo en el Apps Script.
- Si restringes acceso del Web App (no público), las peticiones desde GitHub Pages podrían fallar.
