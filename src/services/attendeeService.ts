import { prisma } from "../config/prisma";

class AttendeeService {
    public static async getListAttendee() {
        const events = await prisma.event.findMany({
            include: {
                attendees: {
                    include: {
                        user: true
                    }
                }
            },
            orderBy: { date: 'asc' }
        });

        return events.map((events) => ({
            eventId: events.id,
            eventName: events.title,
            attendees: events.attendees.map((att) => ({
                id: att.id,
                name: att.user.name,
                email: att.user.email,
                ticketQty: att.ticketQty,
                price: Math.floor(att.totalPaid/att.ticketQty),
                status: 'Checked in'
            })),
        }));
    }
}

export default AttendeeService;