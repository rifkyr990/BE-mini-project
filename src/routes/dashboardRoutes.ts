import { Router } from "express";
import DashboardController from "../controllers/DashboardController";
import { auth } from "../middlewares/authMiddleware";

const router = Router();

router.get('/stats', auth("ORGANIZER"), DashboardController.getStats);

export default router;