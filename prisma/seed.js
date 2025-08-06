const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Cleaning old data...');
  await prisma.attendee.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.point.deleteMany();
  await prisma.event.deleteMany();
  await prisma.user.deleteMany();

  console.log('🌱 Seeding users...');
  const users = [];
  for (let i = 0; i < 10; i++) {
    const role = i < 5 ? 'CUSTOMER' : 'ORGANIZER';
    const user = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        password: faker.internet.password(),
        name: faker.person.fullName(),
        role,
        profileImage: faker.image.avatar(),
      },
    });
    users.push(user);
  }

  const organizers = users.filter((u) => u.role === 'ORGANIZER');
  const customers = users.filter((u) => u.role === 'CUSTOMER');

  console.log('🌱 Seeding events...');
  const events = [];
  for (let i = 0; i < 10; i++) {
    const event = await prisma.event.create({
      data: {
        title: faker.company.catchPhrase(),
        description: faker.lorem.sentences(2),
        date: faker.date.future({ years: 1 }),
        capacity: faker.number.int({ min: 100, max: 500 }),
        seatsTaken: 0,
        organizerId: faker.helpers.arrayElement(organizers).id,
      },
    });
    events.push(event);
  }

  console.log('🌱 Seeding coupons...');
  for (let i = 0; i < 20; i++) {
    const isExpired = i % 2 === 0;
    await prisma.coupon.create({
      data: {
        userId: faker.helpers.arrayElement(customers).id,
        type: faker.helpers.arrayElement(['DISCOUNT', 'VOUCHER']),
        value: faker.number.int({ min: 10, max: 100 }),
        expiresAt: isExpired
          ? faker.date.past({ years: 1 })
          : faker.date.future({ years: 1 }),
        eventId: faker.helpers.arrayElement(events).id,
      },
    });
  }

  console.log('🌱 Seeding points...');
  for (const customer of customers) {
    await prisma.point.create({
      data: {
        userId: customer.id,
        amount: faker.number.int({ min: 20, max: 100 }),
        source: faker.helpers.arrayElement(['REFERRAL', 'PROMOTION']),
        expiresAt: faker.date.future({ years: 1 }),
      },
    });
  }

  console.log('🌱 Seeding transactions & attendees...');
  for (let i = 0; i < 10; i++) {
    const customer = faker.helpers.arrayElement(customers);
    const event = faker.helpers.arrayElement(events);
    const ticketQty = faker.number.int({ min: 1, max: 5 });
    const totalPrice = ticketQty * faker.number.int({ min: 50, max: 150 });

    const transaction = await prisma.transaction.create({
      data: {
        userId: customer.id,
        eventId: event.id,
        ticketQty,
        totalPrice,
        status: faker.helpers.arrayElement(['PENDING', 'COMPLETED']),
      },
    });

    await prisma.attendee.create({
      data: {
        userId: customer.id,
        eventId: event.id,
        ticketQty,
        totalPaid: totalPrice,
      },
    });
  }

  console.log('✅ Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Error while seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
