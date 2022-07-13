const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-err');

module.exports = (req, res, next) => {
  const { cookies } = req;
  if (!cookies) {
    throw new UnauthorizedError('Не удалось авторизоваться');
  }

  let payload;
  try {
    payload = jwt.verify(cookies.jwt, 'secret-key');
  } catch {
    throw new UnauthorizedError('Необходима авторизация');
  }
  req.user = payload;
  next();
};
