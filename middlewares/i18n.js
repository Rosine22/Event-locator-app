const i18next = require('i18next');

module.exports = (req, res, next) => {
  const language = req.user?.language_preference || req.headers['accept-language']?.split(',')[0] || 'en';
  i18next.changeLanguage(language);
  req.t = i18next.t;
  next();
};