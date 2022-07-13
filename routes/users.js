const router = require('express').Router();
const { celebrate } = require('celebrate');
const { userMainInfoSchemaValidation, userAvatarSchemaValidation } = require('../models/user');
const {
  getUsers, getUser, getCurrentUser, updateUser, updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/me', getCurrentUser);

router.get('/:userId', getUser);

router.patch('/me', celebrate(userMainInfoSchemaValidation), updateUser);

router.patch('/me/avatar', celebrate(userAvatarSchemaValidation), updateAvatar);

module.exports = router;
