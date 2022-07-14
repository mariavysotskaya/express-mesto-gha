const mongoose = require('mongoose');
const { Joi } = require('celebrate');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: 'Некорректно указан email',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: [2, 'Значение должно быть больше 2 символов'],
    maxlength: [30, 'Значение должно быть меньше 30 символов'],
  },
  about: {
    type: String,
    default: 'Исследователь',
    minlength: [2, 'Значение должно быть больше 2 символов'],
    maxlength: [30, 'Значение должно быть меньше 30 символов'],
  },
  avatar: {
    type: String,
    validate: {
      validator: (value) => (validator.isURL(value, { require_protocol: true })),
      message: 'Ссылка указана некорректно',
    },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
});

const validateURL = (value) => {
  if (!validator.isURL(value, { require_protocol: true })) {
    throw new Error('Ссылка указана некорректно');
  }
  return value;
};

module.exports = mongoose.model('user', userSchema);

module.exports.userSchemaValidation = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(validateURL),
  }),
};

module.exports.userCredentialsSchemaValidation = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
};

module.exports.userMainInfoSchemaValidation = {
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
};

module.exports.userAvatarSchemaValidation = {
  body: Joi.object().keys({
    avatar: Joi.string().required().custom(validateURL),
  }),
};
