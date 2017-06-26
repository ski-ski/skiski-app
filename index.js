const express = require('express');
const app = express();
const portNumber = 3000;

app.use((req, res) => {
  res.sendStatus(404);
});

app.listen(portNumber, () => {
  console.log(`Listening on port ${portNumber}`);
});
