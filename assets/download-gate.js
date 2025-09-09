/* BibliotecaLEGAL · Download Gate (Google Sheets)
   v1.0 | Autor: ChatGPT (para Anaid)
   Endpoint: Apps Script Web App (Anyone)
*/

/* ====== CONFIG ====== */
const ENDPOINT = "https://script.google.com/macros/s/AKfycbyFHt78xebhiS06_ZXOrV3U9bZo5-BB9F9-J5fiCRTdNsmPcXebepBhsZsbdDY7W7XD/exec"; // <-- Tu Web App URL ya insertada
const POLICY_VERSION = "v1.0";

/* Detecta enlaces de descarga (extensiones comunes o atributo data-download) */
const SELECTOR = 'a[data-download], a[href$=".pdf"], a[href$=".doc"], a[href$=".docx"], a[href$=".pptx"], a[href$=".xlsx"], a[download]';

function isValidEmail(v){ return /.+@.+\..+/.test(String(v||"").trim()); }

async function logToSheets(payload){
  try {
    await fetch(ENDPOINT, {
      method: "POST",
      mode: "no-cors", // evita CORS; no leemos respuesta
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch(e){ console.warn("Sheets log error:", e); }
}

function triggerDownload(href){
  // intento 1: forzar descarga
  const a = document.createElement("a");
  a.href = href;
  a.setAttribute("download", "");
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // fallback por si el navegador ignora 'download'
  setTimeout(()=>{ window.open(href, "_self"); }, 150);
}

/* Modal mínimo inyectado */
function askEmailAndConsent() {
  return new Promise((resolve, reject) => {
    const overlay = document.createElement("div");
    overlay.style.cssText = "position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.5);z-index:9999;";
    const box = document.createElement("div");
    box.style.cssText = "background:#fff;max-width:420px;width:92%;padding:20px;border-radius:16px;box-shadow:0 10px 30px rgba(0,0,0,.2);font-family:system-ui,sans-serif;";
    box.innerHTML = `
      <h3 style="margin:0 0 10px 0;">Descargar formato</h3>
      <p style="margin:0 0 12px 0;font-size:14px;">Ingresa tu correo para habilitar la descarga.</p>
      <input id="dg-email" type="email" placeholder="tu@email.com" style="width:100%;padding:10px;border:1px solid #ddd;border-radius:10px;margin-bottom:10px;" />
      <label style="display:flex;gap:8px;align-items:flex-start;margin-bottom:14px;font-size:13px;line-height:1.3;">
        <input id="dg-consent" type="checkbox" />
        <span>Autorizo el tratamiento de mis datos para gestionar esta descarga. He leído el <a href="/aviso-de-privacidad.html" target="_blank" rel="noopener">Aviso de Privacidad</a> ({POLICY_VERSION}).</span>
      </label>
      <div style="display:flex;gap:10px;justify-content:flex-end;">
        <button id="dg-cancel" style="padding:10px 14px;border:0;border-radius:10px;background:#e5e7eb;cursor:pointer;">Cancelar</button>
        <button id="dg-ok" style="padding:10px 14px;border:0;border-radius:10px;background:#111827;color:#fff;cursor:pointer;">Descargar</button>
      </div>
    `;
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    const saved = localStorage.getItem("biblioteca_email");
    if (saved) box.querySelector("#dg-email").value = saved;

    box.querySelector("#dg-cancel").onclick = () => {
      document.body.removeChild(overlay);
      reject(new Error("cancelled"));
    };
    box.querySelector("#dg-ok").onclick = () => {
      const email = box.querySelector("#dg-email").value.trim().toLowerCase();
      const consent = box.querySelector("#dg-consent").checked;
      if (!isValidEmail(email)) { alert("Email inválido."); return; }
      if (!consent) { alert("Debes aceptar el Aviso de Privacidad."); return; }
      localStorage.setItem("biblioteca_email", email);
      document.body.removeChild(overlay);
      resolve({ email, consent });
    };
  });
}

/* Extrae id/nombre desde el href, si no vienen por data-attrs */
function fileInfoFromHref(href) {
  try {
    const url = new URL(href, location.href);
    const filename = (url.pathname.split("/").pop() || "").trim();
    const docName = filename || "documento";
    const docId = (docName.replace(/\.[a-z0-9]+$/i, "") || "documento").toLowerCase();
    return { docId, docName };
  } catch { return { docId: "documento", docName: "documento" }; }
}

/* Intercepta clics de descarga */
function decorateLinks() {
  document.querySelectorAll(SELECTOR).forEach((el) => {
    if (el.dataset.dgBound === "1") return;
    el.dataset.dgBound = "1";

    el.addEventListener("click", async (e) => {
      // bypass opcional: data-skip-gate="1"
      if (el.dataset.skipGate === "1") return;

      e.preventDefault();
      const href = el.getAttribute("href");
      if (!href) { alert("No se encontró el archivo a descargar."); return; }

      const docId   = el.dataset.docId   || fileInfoFromHref(href).docId;
      const docName = el.dataset.docName || fileInfoFromHref(href).docName;

      try {
        const { email } = await askEmailAndConsent();

        // UX primero: descarga inmediata
        triggerDownload(href);

        // Registro en Sheets (payload compatible con tu Apps Script)
        const payload = {
          email,
          pdf: href,                    // tu servidor espera 'pdf'
          ua: navigator.userAgent
        };
        logToSheets(payload);           // fail-open
      } catch (_) {
        /* cancelado */
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", decorateLinks);
