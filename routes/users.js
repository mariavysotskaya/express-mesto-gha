const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { userMainInfoSchemaValidation, userAvatarSchemaValidation } = require('../models/user');
const {
  getUsers, getUser, getCurrentUser, updateUser, updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/me', getCurrentUser);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
}), getUser);

router.patch('/me', celebrate(userMainInfoSchemaValidation), updateUser);

router.patch('/me/avatar', celebrate(userAvatarSchemaValidation), updateAvatar);

module.exports = router;
