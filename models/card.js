const mongoose = require('mongoose');

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
