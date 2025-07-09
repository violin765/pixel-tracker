const express = require('express');
const fs = require('fs');
const app = express();

app.get('/pixel.png', (req, res) => {
  const email = req.query.email || 'unknown';
  const log = `${new Date().toISOString()},${email}\n`;
  fs.appendFileSync('log.csv', log);

  // 1x1 прозрачный PNG в base64
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
