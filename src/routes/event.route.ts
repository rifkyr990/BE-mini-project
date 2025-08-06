import { Router } from 'express';
import EventController from '../controllers/EventController';
import { auth } from '../middlewares/authMiddleware';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });

class EventRouter {
    private router: Router;
    private controller: EventController;

    constructor() {
        this.router = Router();
        this.controller = new EventController();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // Public routes
        this.router.get('/', this.controller.getAllEvents);
        this.router.get('/:id', this.controller.getEventById);

        // Protected routes for ORGANIZER
        this.router.use(auth('ORGANIZER'));

        this.router.get('/organizer', this.controller.getEventsByUser);
        this.router.post(
            '/',
            upload.single('banner'),
            this.controller.createEvent
        );
        this.router.put('/:id', this.controller.updateEvent);
        this.router.delete('/:id', this.controller.deleteEvent);
    }

    public getRouter(): Router {
        return this.router;
    }
}

export default EventRouter;
