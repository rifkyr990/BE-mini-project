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
                totalPaid: att.totalPaid,
                status: att.isCheckedIn ? 'Checked In' : 'Pending',
            })),
        }));
    }

    // const { id } = req.params;
    public static async getListAttendeeByID(id: string) {
        const events = await prisma.event.findMany({
            where: { id },
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
            eventLocation: events.location,
            eventDate: events.date,
            eventCapacity: Number(events.capacity),
            eventType: events.type,
            eventSeatsTaken: events.seatsTaken,
            attendees: events.attendees.map((att) => ({
                id: att.id,
                name: att.user.name,
                email: att.user.email,
                ticketQty: att.ticketQty,
                price: Math.floor(att.totalPaid/att.ticketQty),
                totalPaid: att.totalPaid,
                status: att.isCheckedIn ? 'Checked In' : 'Pending',
            })),
        }));
    }

    public static async checkInAttendee(id: string) {
        return await prisma.attendee.update({
            where: { id },
            data: { isCheckedIn: true },
            include: { user: true, event: true }
        })
    }
}

export default AttendeeService;