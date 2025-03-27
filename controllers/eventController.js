const { Event, EventCategory, Sequelize } = require('../models');

exports.createEvent = async (req, res) => {
  const { title, description, location, date, time, categories } = req.body;
  try {
    const event = await Event.create({
      title,
      description,
      location: { type: 'Point', coordinates: [location.longitude, location.latitude] },
      date,
      time,
      created_by: req.user.id,
    });
    if (categories && categories.length > 0) {
      await EventCategory.bulkCreate(
        categories.map((category_id) => ({ event_id: event.id, category_id }))
      );
    }
    res.status(201).json({ message: req.t('event_created'), event });
  } catch (error) {
    res.status(500).json({ message: req.t('server_error'), error: error.message });
  }
};

exports.getEvents = async (req, res) => {
  const { latitude, longitude, radius, categories } = req.query;
  try {
    const where = {};
    if (latitude && longitude && radius) {
      where.location = Sequelize.where(
        Sequelize.fn(
          'ST_DWithin',
          Sequelize.col('location'),
          Sequelize.fn('ST_GeomFromText', `POINT(${longitude} ${latitude})`, 4326),
          parseFloat(radius) * 1000 // Convert km to meters
        ),
        true
      );
    }

    const include = categories
      ? [
          {
            model: EventCategory,
            where: { category_id: { [Sequelize.Op.in]: categories.split(',') } },
          },
        ]
      : [];

    const events = await Event.findAll({ where, include });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: req.t('server_error'), error: error.message });
  }
};

exports.updateEvent = async (req, res) => {
  const { id } = req.params;
  const { title, description, location, date, time, categories } = req.body;
  try {
    const event = await Event.findByPk(id);
    if (!event || event.created_by !== req.user.id) {
      return res.status(403).json({ message: req.t('unauthorized') });
    }
    await event.update({
      title: title || event.title,
      description: description || event.description,
      location: location
        ? { type: 'Point', coordinates: [location.longitude, location.latitude] }
        : event.location,
      date: date || event.date,
      time: time || event.time,
    });
    if (categories) {
      await EventCategory.destroy({ where: { event_id: event.id } });
      await EventCategory.bulkCreate(
        categories.map((category_id) => ({ event_id: event.id, category_id }))
      );
    }
    res.json({ message: req.t('event_updated') });
  } catch (error) {
    res.status(500).json({ message: req.t('server_error'), error: error.message });
  }
};

exports.deleteEvent = async (req, res) => {
  const { id } = req.params;
  try {
    const event = await Event.findByPk(id);
    if (!event || event.created_by !== req.user.id) {
      return res.status(403).json({ message: req.t('unauthorized') });
    }
    await event.destroy();
    res.json({ message: req.t('event_deleted') });
  } catch (error) {
    res.status(500).json({ message: req.t('server_error'), error: error.message });
  }
};