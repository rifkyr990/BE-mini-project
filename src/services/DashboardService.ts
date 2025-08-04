import { prisma } from "../config/prisma";

class DashboardService {
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
}

export default DashboardService;