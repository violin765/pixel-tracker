const express = require('express');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const app = express();

const CREDS = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT || '{}');
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

async function logToSheet(email) {
  if (!SPREADSHEET_ID || !CREDS.client_email) return;

  const doc = new GoogleSpreadsheet(SPREADSHEET_ID);
  await doc.useServiceAccountAuth(CREDS);
  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0];
  await sheet.addRow({
    Email: email,
    Timestamp: new Date().toISOString()
  });
}

app.get('/pixel.png', async (req, res) => {
  const email = req.query.email || 'unknown';
  const timestamp = new Date().toISOString();
  const log = `${timestamp},${email}`;
  
  // 1. Пишем открытие в Google Sheets
  logToSheet(email).catch(console.error);

  // 2. Логируем в консоль для Vercel Runtime Logs
  console.log(log);

  // 3. Отдаём пиксель
  const img = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII=',
    'base64'
  );
  res.set('Content-Type', 'image/png');
  res.send(img);
});

app.listen(3000, () => {
  console.log('Pixel server started');
});
