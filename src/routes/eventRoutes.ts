import { Router } from 'express';
import EventController from '../controllers/EventController';
import { auth } from '../middlewares/authMiddleware';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();
const eventController = new EventController();

router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEventById);
router.post('/', auth('ORGANIZER'), upload.single('banner'), eventController.createEvent);
router.put('/:id', auth('ORGANIZER'), eventController.updateEvent);
router.delete('/:id',auth('ORGANIZER'), eventController.deleteEvent);

export default router;
