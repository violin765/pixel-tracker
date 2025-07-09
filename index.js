const express = require('express');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const app = express();

const CREDS = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT || '{test-pixel-tracking@tracking-pixel-test-465409.iam.gserviceaccount.com}');
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

async function logToSheet(email) {
  if (!SPREADSHEET_ID || !CREDS.client_email) return;

  const doc = new GoogleSpreadsheet(19BS80eR5h852aLWvQh9iCVPXUxdIBy-8HKk75sPbpN0);
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
  logToSheet(email).catch(console.error);

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
