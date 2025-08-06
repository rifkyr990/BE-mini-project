// dashboard.service.ts
import { prisma } from "../config/prisma";
import { subDays, subMonths, startOfDay, startOfMonth } from "date-fns";

class DashboardService {
    // Fungsi existing tetap bisa kamu pakai
    public static async getStatistics(organizerId: string) {
        const [totalEvents, totalTransactions, acceptTransaction] = await Promise.all([
            prisma.event.count({ where: { organizerId }}),
            prisma.transaction.count({
                where: { event: { organizerId }}
            }),
            prisma.transaction.count({
                where: {
                    status: 'ACCEPTED', event: { organizerId }
                }
            }),
        ]);

        const [totalTicketsSold, totalRevenue] = await Promise.all([
            prisma.transaction.aggregate({
                where: { event: { organizerId } },
                _sum: { ticketQty: true },
            }),
            prisma.transaction.aggregate({
                where: { event: { organizerId } },
                _sum: { totalPrice: true },
            }),
        ]);

        return {
            totalEvents,
            totalTransactions,
            acceptTransaction,
            totalTicketsSold: totalTicketsSold._sum.ticketQty || 0,
            totalRevenue: totalRevenue._sum.totalPrice || 0,
        };
    }

    public static async getChartData(organizerId: string, filter: "daily" | "monthly" | "yearly") {
        let groupBy: any;
        let dateFrom: Date;

        switch (filter) {
            case "daily":
                groupBy = { by: ['createdAt'], _sum: { ticketQty: true, totalPrice: true }, _count: true };
                dateFrom = subDays(new Date(), 7); // 7 hari terakhir
                break;
            case "monthly":
                groupBy = { by: ['createdAt'], _sum: { ticketQty: true, totalPrice: true }, _count: true };
                dateFrom = subMonths(new Date(), 6); // 6 bulan terakhir
                break;
            case "yearly":
                groupBy = { by: ['createdAt'], _sum: { ticketQty: true, totalPrice: true }, _count: true };
                dateFrom = new Date(new Date().getFullYear(), 0, 1); // Awal tahun
                break;
        }

        const transactions = await prisma.transaction.findMany({
            where: {
                event: { organizerId },
                createdAt: {
                    gte: dateFrom,
                },
            },
            orderBy: { createdAt: 'asc' },
            select: {
                createdAt: true,
                ticketQty: true,
                totalPrice: true,
            }
        });

        const result: Record<string, { peserta: number, pendapatan: number, transaksi: number }> = {};

        transactions.forEach(tx => {
            let key: string;

            const date = new Date(tx.createdAt);
            if (filter === "daily") key = date.toISOString().split("T")[0]; // YYYY-MM-DD
            else if (filter === "monthly") key = `${date.getFullYear()}-${date.getMonth() + 1}`; // YYYY-M
            else key = `${date.getFullYear()}`; // YYYY

            if (!result[key]) {
                result[key] = { peserta: 0, pendapatan: 0, transaksi: 0 };
            }

            result[key].peserta += tx.ticketQty;
            result[key].pendapatan += Number(tx.totalPrice);
            result[key].transaksi += 1;
        });

        return result;
    }
}

export default DashboardService;
