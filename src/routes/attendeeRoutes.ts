import { Router } from "express";
import AttendeeController from "../controllers/AttendeeController"
import { auth } from "../middlewares/authMiddleware";

const router = Router();

router.get('/grouped-by-event',auth('ORGANIZER'), AttendeeController.getListAttendee);
export default router;