const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { cardMainInfoSchemaValidation } = require('../models/card');
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

const paramsIDValidation = {
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
};

router.get('/', getCards);

router.post('/', celebrate(cardMainInfoSchemaValidation), createCard);

router.delete('/:cardId', celebrate(paramsIDValidation), deleteCard);

router.put('/:cardId/likes', celebrate(paramsIDValidation), likeCard);

router.delete('/:cardId/likes', celebrate(paramsIDValidation), dislikeCard);

module.exports = router;
