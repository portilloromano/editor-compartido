const pem = require('pem');
const express = require('express');
const http = require('http');
const https = require('https');
const cors = require('cors');
const Socket = require('./modules/Socket');

const port = process.env.PORT || 8000;

pem.createCertificate({ days: 1, selfSigned: true }, function (err, keys) {
  if (err) {
    throw err
  }

  const app = express();
  app.use(cors());
  // const server = https.createServer({ key: keys.serviceKey, cert: keys.certificate }, app);
  const server = http.createServer(app);

  Socket(server);

  server.listen(port, () => console.log(`Server is running on port ${port}.`));
});