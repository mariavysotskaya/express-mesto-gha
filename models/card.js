const mongoose = require('mongoose');
const { Joi } = require('celebrate');

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
      validator(v) {
        return /https?:\/\/\S/.test(v);
      },
      message: 'Ссылка указана некорректно',
    },
  },
  owner: {
    type: mongoose.ObjectId,
    required: [true, 'Поле обязательно'],
  },
  likes: {
    type: [mongoose.ObjectId],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);

module.exports.cardMainInfoSchemaValidation = {
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required(),
  }),
};
