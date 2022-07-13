const Card = require('../models/card');
const { DATA_ERROR_CODE, NOT_FOUND_ERROR_CODE, DEFAULT_ERROR_CODE } = require('../errors/error-codes');

const getCards = (req, res, next) => {
  Card.find()
    .then((data) => res.send(data))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send({ card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(DATA_ERROR_CODE).send({ message: 'Переданы невалидные значения' });
        return;
      }
      next(err);
    });
};

const deleteCard = (req, res) => {
  Card.findOneAndDelete({ _id: req.params.cardId })
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Не найдена карточка с указанным _id' });
        return;
      }
      if (card.owner !== req.user._id) {
        res.status(403).send({ message: 'Нет прав на удаление карточки' });
      } else {
        res.send({ message: 'Карточка удалена' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(DATA_ERROR_CODE).send({ message: 'Передан некорректный _id карточки' });
        return;
      }
      res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка сервера' });
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    { _id: req.params.cardId },
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Передан несуществующий _id карточки' });
        return;
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(DATA_ERROR_CODE).send({ message: 'Переданы некорректные данные для постановки/снятия лайка' });
        return;
      }
      next(err);
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    { _id: req.params.cardId },
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Передан несуществующий _id карточки' });
        return;
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(DATA_ERROR_CODE).send({ message: 'Переданы некорректные данные для постановки/снятия лайка' });
        return;
      }
      next(err);
    });
};

module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};
