const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Поле обязательно'],
    minlength: [2, 'Значение должно быть больше 2 символов'],
    maxlength: [30, 'Значение должно быть меньше 30 символов'],
  },
  about: {
    type: String,
    required: [true, 'Поле обязательно'],
    minlength: [2, 'Значение должно быть больше 2 символов'],
    maxlength: [30, 'Значение должно быть меньше 30 символов'],
  },
  avatar: {
    type: String,
    required: [true, 'Поле обязательно'],
  },
});

module.exports = mongoose.model('user', userSchema);
