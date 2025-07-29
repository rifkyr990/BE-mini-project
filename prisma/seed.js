const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Buat user event organizer
    const organizer = await prisma.user.create({
        data: {
            email: 'organizer@example.com',
            password: 'hashed_password',
            name: 'Event Organizer',
            role: 'ORGANIZER',
        },
    });

  // Buat event
    const event = await prisma.event.create({
        data: {
        title: 'Tech Conference 2025',
        description: 'A big tech event',
        date: new Date('2025-10-01'),
        organizerId: organizer.id,
        },
    });

  // Buat user customer dengan referral
    const referrer = await prisma.user.create({
        data: {
        email: 'referrer@example.com',
        password: 'hashed_password',
        name: 'Referrer User',
        role: 'CUSTOMER',
        },
    });

    const referred = await prisma.user.create({
        data: {
        email: 'newuser@example.com',
        password: 'hashed_password',
        name: 'New User',
        role: 'CUSTOMER',
        referredById: referrer.id,
        },
    });

  // Tambah point untuk referrer
    await prisma.point.create({
        data: {
        userId: referrer.id,
        amount: 10000,
        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 3 bulan
        },
    });

  // Tambah kupon referral untuk user baru
    await prisma.coupon.create({
        data: {
        userId: referred.id,
        type: 'DISCOUNT',
        value: 10000,
        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        },
    });

  // Tambah voucher khusus event
    await prisma.coupon.create({
        data: {
        userId: referred.id,
        type: 'VOUCHER',
        value: 15000,
        eventId: event.id,
        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        },
    });

    console.log('Seeder complete');
}

main()
    .catch((e) => console.error(e))
    .finally(() => prisma.$disconnect());