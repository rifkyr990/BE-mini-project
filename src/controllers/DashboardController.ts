import { Response } from "express";
import { asyncHandler } from "../helpers/asyncHandler";
import DashboardService from "../services/DashboardService";
import { AuthRequest } from "../types/authRequest";  // pastikan ini sudah define user di req

class DashboardController {
    public getStats = asyncHandler(async (req: AuthRequest, res: Response) => {
        if (req.user?.role !== 'ORGANIZER') {
        return res.status(403).json({ message: "Akses hanya untuk ORGANIZER" });
        }

        const stats = await DashboardService.getStatistics(req.user.id);
        res.json(stats);
    });

    public getChartData = asyncHandler(async (req: AuthRequest, res: Response) => {
        if (req.user?.role !== 'ORGANIZER') {
            return res.status(403).json({ message: "Akses hanya untuk ORGANIZER" });
        }

        const organizerId = req.user.id;  // gunakan user.id sebagai organizerId
        const filter = (req.query.filter as string) || "daily";

        if (!["daily", "monthly", "yearly"].includes(filter)) {
            return res.status(400).json({ message: "Filter tidak valid" });
        }

        const data = await DashboardService.getChartData(organizerId, filter as "daily" | "monthly" | "yearly");
        res.json(data);
    });

}

export default new DashboardController();
