import { Router } from "express";
import AttendeeController from "../controllers/AttendeeController";
import { auth } from "../middlewares/authMiddleware";

class AttendeeRouter {
    private router: Router;

    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // Semua route hanya untuk ORGANIZER
        this.router.get('/grouped-by-event', auth('ORGANIZER'), AttendeeController.getListAttendee);
        this.router.get('/:id', auth('ORGANIZER'), AttendeeController.getListAttendeeByID);
        this.router.patch('/:id/check-in', auth('ORGANIZER'), AttendeeController.markCheckIn);
    }

    public getRouter(): Router {
        return this.router;
    }
}

export default AttendeeRouter;
