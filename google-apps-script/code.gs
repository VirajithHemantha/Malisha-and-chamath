const SPREADSHEET_ID = '1g8kllbbrl7LYF9vzs41TLCSPBVEeGYGBXohBkM_S8KE';

const SHEETS = {
  rsvp: {
    name: 'RSVP',
    headers: ['Timestamp', 'Full Name', 'Guests', 'Dietary Notes'],
    fields: ['fullName', 'guests', 'dietaryNotes'],
    widths: [170, 240, 90, 360],
  },
  wishes: {
    name: 'Wishes',
    headers: ['Timestamp', 'Name', 'Message'],
    fields: ['name', 'message'],
    widths: [170, 240, 520],
  },
};

const MAX_FIELD_LENGTH = 2000;

// Run this once from the Apps Script editor to authorise the script
// and create both sheets with their headers straight away.
function setup() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  Object.keys(SHEETS).forEach(function (key) {
    getOrCreateSheet_(ss, SHEETS[key]);
  });
}

function doPost(e) {
  const lock = LockService.getScriptLock();

  try {
    const payload = parsePayload_(e);
    const config = SHEETS[String(payload.type || '').toLowerCase()];

    if (!config) {
      return jsonResponse_({ ok: false, error: 'Invalid type. Use "rsvp" or "wishes".' });
    }

    const values = config.fields.map(function (field) {
      return clean_(payload[field]);
    });

    if (!values[0]) {
      return jsonResponse_({ ok: false, error: 'Name is required.' });
    }

    lock.waitLock(20000);

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = getOrCreateSheet_(ss, config);
    sheet.appendRow([new Date()].concat(values));

    return jsonResponse_({ ok: true });
  } catch (error) {
    return jsonResponse_({
      ok: false,
      error: String(error && error.message ? error.message : error),
    });
  } finally {
    if (lock.hasLock()) {
      lock.releaseLock();
    }
  }
}

function doGet() {
  return jsonResponse_({
    ok: true,
    message: 'Wedding form endpoint is running.',
  });
}

function parsePayload_(e) {
  const contents = e && e.postData && e.postData.contents ? e.postData.contents : '';

  if (contents) {
    try {
      return JSON.parse(contents);
    } catch (_error) {
      // Not JSON; fall back to form parameters below.
    }
  }

  return e && e.parameter ? e.parameter : {};
}

function getOrCreateSheet_(ss, config) {
  let sheet = ss.getSheetByName(config.name);
  if (!sheet) {
    sheet = ss.insertSheet(config.name);
  }

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, config.headers.length)
      .setValues([config.headers])
      .setFontWeight('bold')
      .setFontColor('#ffffff')
      .setBackground('#6b5544')
      .setHorizontalAlignment('center');
    sheet.setFrozenRows(1);
    sheet.getRange(2, 1, sheet.getMaxRows() - 1, 1).setNumberFormat('yyyy-mm-dd hh:mm:ss');
    sheet.getRange(1, 1, sheet.getMaxRows(), config.headers.length).setWrap(true).setVerticalAlignment('top');
    config.widths.forEach(function (width, index) {
      sheet.setColumnWidth(index + 1, width);
    });
  }

  return sheet;
}

// Trims the value and stops guest input from being run as a spreadsheet formula.
function clean_(value) {
  const text = String(value == null ? '' : value).trim().slice(0, MAX_FIELD_LENGTH);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function jsonResponse_(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
