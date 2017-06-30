const express = require('express');
const app = express();
const portNumber = process.env.PORT || 3000;

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const path = require('path');

const users = require('./routes/users');
const token = require('./routes/token');
const resorts = require('./routes/resorts');
const trails = require('./routes/trails');
const ratings = require('./routes/ratings');
const favorites = require('./routes/favorites');

app.use(bodyParser.json());
app.use(cookieParser());

app.use('/apidoc', express.static(path.join(__dirname, 'apidoc')));
app.get('/', (req, res) => {
  res.status(200).send('Welcome to skiski.');
};

app.use(users);
app.use(token);
app.use(resorts);
app.use(trails);
app.use(ratings);
app.use(favorites);

app.use((req, res) => {
  res.sendStatus(404);
});

app.listen(portNumber, () => {
  console.log(`Listening on port ${portNumber}`);
});

module.exports = app;
