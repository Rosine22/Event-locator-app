const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, UserPreference } = require('../models');

exports.register = async (req, res) => {
  const { username, email, password, location, language_preference, categories } = req.body;
  try {
    const password_hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password_hash,
      location: location ? { type: 'Point', coordinates: [location.longitude, location.latitude] } : null,
      language_preference: language_preference || 'en',
    });
    if (categories && categories.length > 0) {
      await UserPreference.bulkCreate(
        categories.map((category_id) => ({ user_id: user.id, category_id }))
      );
    }
    res.status(201).json({ message: req.t('user_registered') });
  } catch (error) {
    res.status(500).json({ message: req.t('server_error'), error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ message: req.t('invalid_credentials') });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: req.t('server_error'), error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  const { location, language_preference, categories } = req.body;
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: req.t('user_not_found') });

    await user.update({
      location: location ? { type: 'Point', coordinates: [location.longitude, location.latitude] } : user.location,
      language_preference: language_preference || user.language_preference,
    });

    if (categories) {
      await UserPreference.destroy({ where: { user_id: user.id } });
      await UserPreference.bulkCreate(
        categories.map((category_id) => ({ user_id: user.id, category_id }))
      );
    }
    res.json({ message: req.t('profile_updated') });
  } catch (error) {
    res.status(500).json({ message: req.t('server_error'), error: error.message });
  }
};