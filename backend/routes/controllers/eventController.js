import Event from '../../models/Events.js';

export const createEvent = async (req, res) => {
  try {
    const { title, description, date, location, videoLink } = req.body;
    if (!title || !date) return res.status(400).json({ message: 'Title & date required' });
    const event = await Event.create({ title, description, date, location, videoLink, createdBy: req.user._id });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 }).populate('createdBy', 'name');
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const toggleRSVP = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    const idx = event.attendees.findIndex(a => a.toString() === req.user._id.toString());
    if (idx === -1) event.attendees.push(req.user._id);
    else event.attendees.splice(idx, 1);
    await event.save();
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // Check if user is creator
    if (event.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await event.deleteOne();
    res.json({ message: 'Event deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
