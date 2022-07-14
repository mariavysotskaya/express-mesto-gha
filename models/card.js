const mongoose = require('mongoose');
const { Joi } = require('celebrate');
const validator = require('validator');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Поле обязательно'],
    minlength: [2, 'Значение должно быть больше 2 символов'],
    maxlength: [30, 'Значение должно быть меньше 30 символов'],
  },
  link: {
    type: String,
    required: [true, 'Поле обязательно'],
    validate: {
      validator: (value) => (validator.isURL(value, { require_protocol: true })),
      message: 'Ссылка указана некорректно',
    },
  },
  owner: {
    type: mongoose.ObjectId,
    ref: 'user',
    required: [true, 'Поле обязательно'],
  },
  likes: {
    type: [mongoose.ObjectId],
    ref: 'user',
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const validateURL = (value) => {
  if (!validator.isURL(value, { require_protocol: true })) {
    throw new Error('Ссылка указана некорректно');
  }
  return value;
};

module.exports = mongoose.model('card', cardSchema);

module.exports.cardMainInfoSchemaValidation = {
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom(validateURL),
  }),
};
