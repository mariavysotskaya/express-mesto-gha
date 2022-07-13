const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const DataError = require('../errors/data-err');
const UnauthorizedError = require('../errors/unauthorized-err');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');

const options = { new: true, runValidators: true };

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new DataError('Не заполнено обязательное поле');
  }

  if (!validator.isEmail(email)) {
    throw new DataError('Некорректно указан email');
  }

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Пользователь не зарегистрирован');
      }
      bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError('Неправильный пароль');
          }
          const token = jwt.sign({ _id: user._id }, 'secret-key', { expiresIn: '7d' });
          res
            .cookie('jwt', token, { httpOnly: true })
            .send({ message: 'Авторизация успешна' });
        })
        .catch(next);
    })
    .catch(next);
};

const getUsers = (_req, res, next) => {
  User.find()
    .then((data) => res.send(data))
    .catch(next);
};

const getUser = (req, res, next) => {
  User.findById({ _id: req.params.userId })
    .then((data) => {
      if (!data) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      res.send(data);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new DataError('Указан невалидный _id');
      }
      next(err);
    });
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  if (!email || !password) {
    throw new DataError('Не заполнено обязательное поле');
  }

  if (!validator.isEmail(email)) {
    throw new DataError('Некорректно указан email');
  }

  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ForbiddenError('Такой пользователь уже существует');
      } else {
        bcrypt.hash(password, 10)
          .then((hash) => {
            User.create({
              email, password: hash, name, about, avatar,
            })
              .then((data) => res.status(201).send({ data }))
              .catch((err) => {
                if (err.name === 'ValidationError') {
                  throw new DataError('Переданы невалидные значения');
                }
                next(err);
              });
          });
      }
    });
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, options)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new DataError('Переданы невалидные значения');
      }
      if (err.name === 'CastError') {
        throw new DataError('Передан некорректный _id');
      }
      next(err);
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, options)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new DataError('Переданы невалидные значения');
      }
      if (err.name === 'CastError') {
        throw new DataError('Передан некорректный _id');
      }
      next(err);
    });
};

const getCurrentUser = (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.send({ user });
    })
    .catch(next);
};

module.exports = {
  login, getUsers, getUser, getCurrentUser, createUser, updateUser, updateAvatar,
};
