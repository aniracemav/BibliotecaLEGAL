// Google Apps Script para registrar descargas en un Google Sheet.
// Reemplaza SPREADSHEET_ID con el ID de tu Sheet.
// Asegúrate de tener las columnas: timestamp, email, pdf, userAgent (fila 1).

const SPREADSHEET_ID = '1-gnrH676vkfVZ4JS8nzaA76eVja_0LyZIRHgJmVpgiw8'
const SHEET_NAME = 'Hoja 1'; 

function doOptions(e) {
  return ContentService.createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
}

function doPost(e) {
  try {
    const body = e.postData && e.postData.contents ? JSON.parse(e.postData.contents) : null;
    if (!body || !body.email) {
      return _json({ ok: false, error: 'missing-email' });
    }
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sh = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];
    const row = [
      new Date(),
      body.email || '',
      body.pdf || '',
      body.ua || ''
    ];
    sh.appendRow(row);
    return _json({ ok: true });
  } catch (err) {
    return _json({ ok: false, error: String(err) });
  }
}

function _json(obj) {
  const output = ContentService.createTextOutput(JSON.stringify(obj));
  output.setMimeType(ContentService.MimeType.JSON);
  output.setHeaders({
    'Access-Control-Allow-Origin': '*'
  });
  return output;
}
