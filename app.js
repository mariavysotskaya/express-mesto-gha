const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');

const PORT = 3000;
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { NOT_FOUND_ERROR_CODE } = require('./utils/errors');

const app = express();

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  req.user = {
    _id: '62c991f8d43ab0da6c079a52',
  };
  next();
});

app.use('/users', userRouter);

app.use('/cards', cardRouter);

app.get('*', (req, res) => {
  res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Страница не найдена' });
});

app.listen(PORT, () => {
  console.log('App listening on port 3000');
});
