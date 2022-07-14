const express = require('express');
const mongoose = require('mongoose');
const { celebrate, errors } = require('celebrate');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const PORT = 3000;
const { userSchemaValidation, userCredentialsSchemaValidation } = require('./models/user');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const NotFoundError = require('./errors/not-found-err');

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());

mongoose.connect('mongodb://localhost:27017/mestodb');

app.post('/signup', celebrate(userSchemaValidation), createUser);
app.post('/signin', celebrate(userCredentialsSchemaValidation), login);

app.use(auth);

app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.use('*', () => {
  throw new NotFoundError('Страница не найдена');
});

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message });
  next();
});

app.listen(PORT);
