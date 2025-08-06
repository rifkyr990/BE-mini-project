import { Router } from "express";
import AttendeeController from "../controllers/AttendeeController"
import { auth } from "../middlewares/authMiddleware";

const router = Router();

router.get('/grouped-by-event',auth('ORGANIZER'), AttendeeController.getListAttendee);
router.get('/:id', auth('ORGANIZER'), AttendeeController.getListAttendeeByID);
router.patch('/:id/check-in', auth('ORGANIZER'),AttendeeController.markCheckIn);

export default router;