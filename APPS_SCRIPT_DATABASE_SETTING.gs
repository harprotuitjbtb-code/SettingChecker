const APP_NAME = 'Relay Setting Checker - Database Setting Writer';

function doGet() {
  return jsonResponse({ ok: true, app: APP_NAME, message: 'Apps Script Web App aktif.' });
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const payload = JSON.parse(e.postData.contents || '{}');
    if (payload.action !== 'updateSettingDatabase') {
      return jsonResponse({ ok: false, message: 'Action tidak dikenal.' });
    }

    const ss = SpreadsheetApp.openById(payload.spreadsheetId);
    const sheet = ss.getSheetByName(payload.sheetName);
    if (!sheet) throw new Error('Sheet database tidak ditemukan: ' + payload.sheetName);

    const giBayColumn = columnNameToNumber(payload.giBayColumn || 'K');
    const headerRow = Number(payload.headerRow || 9);
    const giBayKey = normalizeKey(payload.giBayKey || '');
    const lastRow = sheet.getLastRow();
    const lastColumn = sheet.getLastColumn();

    const giBayValues = sheet.getRange(1, giBayColumn, lastRow, 1).getValues();
    let targetRow = -1;
    for (let i = 0; i < giBayValues.length; i++) {
      if (normalizeKey(giBayValues[i][0]) === giBayKey) {
        targetRow = i + 1;
        break;
      }
    }
    if (targetRow < 0) throw new Error('Baris GI - Bay tidak ditemukan: ' + payload.giBayKey);

    const headers = sheet.getRange(headerRow, 1, 1, lastColumn).getValues()[0];
    const headerMap = {};
    headers.forEach(function(header, index) {
      const key = normalizeKey(header);
      if (key) headerMap[key] = index + 1;
    });

    const migrated = [];
    const failedRows = [];
    let converted = 0;

    (payload.updates || []).forEach(function(item) {
      const key = normalizeKey(item.parameter);
      const col = headerMap[key];
      if (!col) {
        failedRows.push({ parameter: item.parameter, title: item.title, sheet: item.sheet, reason: 'Kolom parameter tidak ditemukan.' });
        return;
      }

      const multiplierResult = parsePositiveMultiplier(item.multiplier);
      if (!multiplierResult.valid) {
        failedRows.push({
          parameter: item.parameter,
          title: item.title,
          sheet: item.sheet,
          reason: multiplierResult.reason
        });
        return;
      }

      const multiplier = multiplierResult.value;
      const originalValue = Object.prototype.hasOwnProperty.call(item, 'originalValue')
        ? item.originalValue
        : item.value;
      let finalValue = originalValue;

      if (multiplier !== 1) {
        const numericResult = parseNumericValue(originalValue);
        if (!numericResult.valid) {
          failedRows.push({
            parameter: item.parameter,
            title: item.title,
            sheet: item.sheet,
            reason: 'Nilai sumber bukan angka dan tidak dapat dikalikan dengan pengali ' + multiplier + '.'
          });
          return;
        }
        finalValue = numericResult.value * multiplier;
        if (!isFinite(finalValue)) {
          failedRows.push({
            parameter: item.parameter,
            title: item.title,
            sheet: item.sheet,
            reason: 'Hasil perkalian tidak valid.'
          });
          return;
        }
        converted += 1;
      }

      sheet.getRange(targetRow, col).setValue(finalValue);
      migrated.push({
        parameter: item.parameter,
        originalValue: originalValue,
        multiplier: multiplier,
        value: finalValue,
        row: targetRow,
        column: col
      });
    });

    return jsonResponse({
      ok: true,
      partial: failedRows.length > 0,
      targetRow: targetRow,
      giBayKey: payload.giBayKey,
      migrated: migrated.length,
      converted: converted,
      failed: failedRows.length,
      failedRows: failedRows
    });
  } catch (err) {
    return jsonResponse({ ok: false, message: err.message || String(err) });
  } finally {
    lock.releaseLock();
  }
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function columnNameToNumber(name) {
  let result = 0;
  String(name || '').toUpperCase().replace(/[^A-Z]/g, '').split('').forEach(function(char) {
    result = result * 26 + char.charCodeAt(0) - 64;
  });
  return result || 11;
}


function parsePositiveMultiplier(value) {
  if (value === null || value === undefined || String(value).trim() === '') {
    return { valid: true, value: 1 };
  }
  const raw = String(value).trim().replace(/\s+/g, '');
  if (raw.indexOf(',') >= 0 && raw.indexOf('.') >= 0) {
    return { valid: false, value: NaN, reason: 'Pengali menggunakan koma dan titik sekaligus.' };
  }
  const normalized = raw.replace(',', '.');
  if (!/^[+]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(normalized)) {
    return { valid: false, value: NaN, reason: 'Pengali harus berupa angka lebih besar dari 0.' };
  }
  const numeric = Number(normalized);
  if (!isFinite(numeric) || numeric <= 0) {
    return { valid: false, value: numeric, reason: 'Pengali harus berupa angka lebih besar dari 0.' };
  }
  return { valid: true, value: numeric };
}

function parseNumericValue(value) {
  if (typeof value === 'number') {
    return { valid: isFinite(value), value: value };
  }
  if (value === null || value === undefined || String(value).trim() === '') {
    return { valid: false, value: NaN };
  }
  const normalized = String(value).trim().replace(/,/g, '');
  const numeric = Number(normalized);
  return { valid: isFinite(numeric), value: numeric };
}

function normalizeKey(value) {
  return String(value || '').trim().toLowerCase().replace(/\s+/g, ' ');
}
