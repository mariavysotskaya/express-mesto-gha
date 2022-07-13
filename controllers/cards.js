const Card = require('../models/card');
const DataError = require('../errors/data-err');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');

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
        next(new DataError('Переданы невалидные значения'));
        return;
      }
      next(err);
    });
};

const deleteCard = (req, res, next) => {
  Card.findOne({ _id: req.params.cardId })
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Не найдена карточка с указанным _id'));
        return;
      }
      if (card.owner.equals(req.user._id)) {
        Card.deleteOne({ _id: card._id })
          .then(() => res.send({ message: 'Карточка удалена' }))
          .catch(next);
      } else {
        throw new ForbiddenError('Нет прав на удаление карточки');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new DataError('Передан некорректный _id карточки'));
        return;
      }
      next(err);
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
        throw new NotFoundError('Передан несуществующий _id карточки');
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new DataError('Переданы некорректные данные для постановки/снятия лайка'));
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
        throw new NotFoundError('Передан несуществующий _id карточки');
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new DataError('Переданы некорректные данные для постановки/снятия лайка'));
        return;
      }
      next(err);
    });
};

module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};
