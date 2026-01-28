import express from 'express';
const router = express.Router();
import { getEvents, createEvent, toggleRSVP, deleteEvent } from './controllers/eventController.js';
import auth from '../middleware/authMiddleware.js';

router.get('/', getEvents);
router.post('/', auth, createEvent);
router.post('/:id/rsvp', auth, toggleRSVP);
router.delete('/:id', auth, deleteEvent);

// Join Roundtable Endpoint
router.post('/:id/roundtables/:tableId/join', auth, async (req, res) => {
    try {
        const Events = (await import('../models/Events.js')).default;
        const event = await Events.findById(req.params.id);
        const table = event.roundtables.id(req.params.tableId);

        if (!table) return res.status(404).json({ message: 'Roundtable not found' });

        if (table.attendees.includes(req.user.id)) {
            return res.status(400).json({ message: 'Already joined' });
        }

        if (table.attendees.length >= table.capacity) {
            return res.status(400).json({ message: 'Table full' });
        }

        table.attendees.push(req.user.id);
        await event.save();
        res.json({ message: 'Joined table', table });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

export default router;
