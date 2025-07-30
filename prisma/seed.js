const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Create Users
  const user1 = await prisma.user.create({
    data: {
      email: 'customer@example.com',
      password: 'password123',
      name: 'John Doe',
      role: 'CUSTOMER',
      profileImage: 'https://example.com/profile1.jpg',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'organizer@example.com',
      password: 'password456',
      name: 'Jane Smith',
      role: 'ORGANIZER',
      profileImage: 'https://example.com/profile2.jpg',
    },
  });

  // Create Event
  const event1 = await prisma.event.create({
    data: {
      title: 'Tech Conference 2025',
      description: 'A conference about the latest in technology.',
      date: new Date('2025-05-01T09:00:00Z'),
      capacity: 500,
      seatsTaken: 0,
      organizerId: user2.id, // event organizer is user2
    },
  });

  const event2 = await prisma.event.create({
    data: {
      title: 'Music Festival 2025',
      description: 'A festival for music lovers.',
      date: new Date('2025-06-15T12:00:00Z'),
      capacity: 1000,
      seatsTaken: 0,
      organizerId: user2.id, // event organizer is user2
    },
  });

  // Create Point for User1
  const point1 = await prisma.point.create({
    data: {
      userId: user1.id,
      amount: 50,
      source: 'REFERRAL',
      expiresAt: new Date('2025-12-31T23:59:59Z'),
    },
  });

  // Create Coupons for User1
  const coupon1 = await prisma.coupon.create({
    data: {
      userId: user1.id,
      type: 'DISCOUNT',
      value: 20, // 20% discount
      expiresAt: new Date('2025-12-31T23:59:59Z'),
      eventId: event1.id, // Coupon valid for event1
    },
  });

  const coupon2 = await prisma.coupon.create({
    data: {
      userId: user1.id,
      type: 'VOUCHER',
      value: 100, // $100 voucher
      expiresAt: new Date('2025-12-31T23:59:59Z'),
      eventId: event2.id, // Coupon valid for event2
    },
  });

  // Create Transaction for User1
  const transaction1 = await prisma.transaction.create({
    data: {
      userId: user1.id,
      eventId: event1.id,
      ticketQty: 2,
      totalPrice: 200, // Assuming $100 per ticket
      status: 'PENDING',
    },
  });

  // Create Attendees for Event1
  const attendee1 = await prisma.attendee.create({
    data: {
      userId: user1.id,
      eventId: event1.id,
      ticketQty: 2,
      totalPaid: 200, // Total paid for 2 tickets
    },
  });

  console.log('Seed data has been successfully added.');
}

main()
  .catch(e => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
