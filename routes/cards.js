const router = require('express').Router();
const { celebrate } = require('celebrate');
const { cardMainInfoSchemaValidation } = require('../models/card');
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards);

router.post('/', celebrate(cardMainInfoSchemaValidation), createCard);

router.delete('/:cardId', deleteCard);

router.put('/:cardId/likes', likeCard);

router.delete('/:cardId/likes', dislikeCard);

module.exports = router;
