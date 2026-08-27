import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const adminPassword = await argon2.hash('Admin@123', {
    type: argon2.argon2id,
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@mariana.com' },
    update: {},
    create: {
      email: 'admin@mariana.com',
      name: 'Mariana Aparicio',
      phone: '+5511916379775',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  console.log('Admin user created:', admin.email);

  // Create services
  const services = [
    {
      name: 'Maquiagem Social',
      slug: 'maquiagem-social',
      description: 'Maquiagem completa para eventos sociais, jantares e ocasiões especiais.',
      price: 150,
      duration: 60,
    },
    {
      name: 'Maquiagem para Noivas',
      slug: 'maquiagem-noivas',
      description: 'Maquiagem especial para o grande dia, com teste previo incluso.',
      price: 350,
      duration: 90,
    },
    {
      name: 'Maquiagem para Formatura',
      slug: 'maquiagem-formatura',
      description: 'Maquiagem deslumbrante para sua formatura.',
      price: 180,
      duration: 60,
    },
    {
      name: 'Maquiagem para Eventos',
      slug: 'maquiagem-eventos',
      description: 'Maquiagem glamourosa para festas e eventos noturnos.',
      price: 200,
      duration: 75,
    },
    {
      name: 'Maquiagem Express',
      slug: 'maquiagem-express',
      description: 'Maquiagem rapida e elegante para o dia a dia.',
      price: 90,
      duration: 30,
    },
    {
      name: 'Maquiagem + Cilios',
      slug: 'maquiagem-cilios',
      description: 'Maquiagem completa com aplicação de cilios posticos.',
      price: 200,
      duration: 75,
    },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: {},
      create: service,
    });
  }

  console.log('Services created:', services.length);

  // Create availability (Mon-Sat, 8:00-18:00)
  const availabilityData = [
    { dayOfWeek: 1, startTime: '08:00', endTime: '18:00', active: true }, // Monday
    { dayOfWeek: 2, startTime: '08:00', endTime: '18:00', active: true }, // Tuesday
    { dayOfWeek: 3, startTime: '08:00', endTime: '18:00', active: true }, // Wednesday
    { dayOfWeek: 4, startTime: '08:00', endTime: '18:00', active: true }, // Thursday
    { dayOfWeek: 5, startTime: '08:00', endTime: '18:00', active: true }, // Friday
    { dayOfWeek: 6, startTime: '08:00', endTime: '14:00', active: true }, // Saturday
    { dayOfWeek: 0, startTime: '08:00', endTime: '18:00', active: false }, // Sunday (off)
  ];

  for (const avail of availabilityData) {
    await prisma.availability.create({
      data: avail,
    });
  }

  console.log('Availability created:', availabilityData.length);

  // Create a test client
  const clientPassword = await argon2.hash('Client@123', {
    type: argon2.argon2id,
  });

  const client = await prisma.user.upsert({
    where: { email: 'cliente@teste.com' },
    update: {},
    create: {
      email: 'cliente@teste.com',
      name: 'Maria Silva',
      phone: '+5511999998888',
      password: clientPassword,
      role: 'CLIENT',
      profile: {
        create: {
          preferences: '{}',
          notes: 'Cliente de teste',
        },
      },
    },
  });

  console.log('Test client created:', client.email);

  console.log('Seed completed!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
