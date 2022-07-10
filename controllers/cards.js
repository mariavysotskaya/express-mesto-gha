const Card = require('../models/card');
const { DATA_ERROR_CODE, NOT_FOUND_ERROR_CODE, DEFAULT_ERROR_CODE } = require('../utils/errors');

const getCards = (req, res) => {
  Card.find()
    .then((data) => res.send(data))
    .catch(() => res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка сервера' }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      if (!card) {
        throw new Error();
      }
      return res.send({ card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(DATA_ERROR_CODE).send({ message: 'Переданы невалидные значения' });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка сервера' });
    });
};

const deleteCard = (req, res) => {
  Card.findOneAndRemove({ _id: req.params.cardId })
    .then(() => res.send({ message: 'Карточка удалена' }))
    .catch(() => res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Карточка с указанным _id не найдена' }));
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    { _id: req.params.cardId },
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new Error();
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Передан несуществующий _id карточки' });
      } else {
        res.status(DATA_ERROR_CODE).send({ message: 'Переданы некорректные данные для постановки/снятии лайка' });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка сервера' });
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    { _id: req.params.cardId },
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new Error();
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Передан несуществующий _id карточки' });
      } else {
        res.status(DATA_ERROR_CODE).send({ message: 'Переданы некорректные данные для постановки/снятии лайка' });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка сервера' });
    });
};

module.exports = { getCards, createCard, deleteCard, likeCard, dislikeCard };
