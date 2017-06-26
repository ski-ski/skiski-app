const express = require('express');
const app = express();
const portNumber = 3000;

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')

const users = require('./routes/users');

app.use(bodyParser.json());
app.use(cookieParser());
app.use(users);

app.use((req, res) => {
  res.sendStatus(404);
});

app.listen(portNumber, () => {
  console.log(`Listening on port ${portNumber}`);
});
