import { Router } from "express";
import DashboardController from "../controllers/DashboardController";
import { auth } from "../middlewares/authMiddleware";

class DashboardRouter {
    private router: Router;

    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // All routes are protected for "ORGANIZER"
        this.router.use(auth("ORGANIZER"));

        this.router.get("/stats", DashboardController.getStats);
        this.router.get("/chart-data", DashboardController.getChartData);
    }

    public getRouter(): Router {
        return this.router;
    }
}

export default DashboardRouter;
