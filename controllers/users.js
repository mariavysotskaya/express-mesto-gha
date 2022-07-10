const User = require('../models/user');
const { DATA_ERROR_CODE, NOT_FOUND_ERROR_CODE, DEFAULT_ERROR_CODE } = require('../utils/errors');

const options = { new: true, runValidators: true, upsert: true };

const getUsers = (_req, res) => {
  User.find()
    .then((data) => res.send(data))
    .catch(() => res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка сервера' }));
};

const getUser = (req, res) => {
  User.findOne({ _id: req.params.userId })
    .then((data) => {
      if (!data) {
        throw new Error();
      }
      return res.send(data);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Пользователь по указанному _id не найден' });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка сервера' });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      if (!user) {
        throw new Error();
      }
      return res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(DATA_ERROR_CODE).send({ message: 'Переданы невалидные значения' });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка сервера' });
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, options)
    .then((user) => {
      if (!user) {
        throw new Error();
      }
      return res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(DATA_ERROR_CODE).send({ message: 'Переданы невалидные значения' });
      }
      if (err.name === 'CastError') {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Пользователь по указанному _id не найден' });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка сервера' });
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, options)
    .then((user) => {
      if (!user) {
        throw new Error();
      }
      return res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(DATA_ERROR_CODE).send({ message: 'Переданы невалидные значения' });
      }
      if (err.name === 'CastError') {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Пользователь по указанному _id не найден' });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка сервера' });
    });
};

module.exports = { getUsers, getUser, createUser, updateUser, updateAvatar };
