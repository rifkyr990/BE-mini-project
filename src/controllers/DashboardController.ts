// controllers/DashboardController.ts
import { Response } from "express";
import { asyncHandler } from "../helpers/asyncHandler";
import DashboardService from "../services/DashboardService";
import { AuthRequest } from "../types/authRequest";

class DashboardController {
    public getStats = asyncHandler(async (req: AuthRequest, res: Response) => {
        if (req.user?.role !== 'ORGANIZER') {
            return res.status(403).json({ message: "Akses hanya untuk ORGANIZER" });
        }

        const stats = await DashboardService.getStatistics(req.user.id);
        res.json(stats);
    });
}

export default new DashboardController();
