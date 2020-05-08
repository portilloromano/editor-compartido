const pem = require('pem');
const express = require('express');
const http = require('http');
const https = require('https');
const cors = require('cors');
const Socket = require('./modules/Socket');
const fileManagmentRouter = require('./routes/fileManagment');

const port = process.env.PORT || 8000;

pem.createCertificate({ days: 1, selfSigned: true }, function (err, keys) {
  if (err) {
    throw err
  }

  const app = express();

  // const server = https.createServer({ key: keys.serviceKey, cert: keys.certificate }, app);
  const server = http.createServer(app);

  app.use(cors());
  app.use('/filemanagment', fileManagmentRouter);

  Socket(server);

  server.listen(port, () => console.log(`Server is running on port ${port}.`));
});