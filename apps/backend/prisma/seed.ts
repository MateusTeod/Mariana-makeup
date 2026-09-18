import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

const getSeedValue = (name: string, fallback?: string) => {
  const value = process.env[name] || fallback;
  if (!value && process.env.NODE_ENV === 'production') {
    throw new Error(`Missing required seed environment variable: ${name}`);
  }
  return value as string;
};

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const adminPassword = await argon2.hash(getSeedValue('SEED_ADMIN_PASSWORD', 'Admin@123'), {
    type: argon2.argon2id,
  });

  const admin = await prisma.user.upsert({
    where: { email: getSeedValue('SEED_ADMIN_EMAIL', 'admin@mariana.com') },
    update: {},
    create: {
      email: getSeedValue('SEED_ADMIN_EMAIL', 'admin@mariana.com'),
      name: getSeedValue('SEED_ADMIN_NAME', 'Mariana Aparicio'),
      phone: getSeedValue('SEED_ADMIN_PHONE', '+5511916379775'),
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  console.log('Admin user created:', admin.email);

  // Create services
  const services = [
    {
      name: 'Maquiagem Express',
      slug: 'maquiagem-express',
      description: 'Acabamento sofisticado e pele blindada, ideal para convidadas, eventos corporativos e jantares especiais.',
      price: 140,
      duration: 60,
    },
    {
      name: 'Maquiagem para Noivas',
      slug: 'maquiagem-noivas',
      description: 'Produção completa de alta durabilidade para o seu grande dia, pensada para emocionar e brilhar nas fotos.',
      price: 350,
      duration: 180,
    },
    {
      name: 'Maquiagem para Formatura',
      slug: 'maquiagem-formatura',
      description: 'Look deslumbrante e expressivo para sua noite de celebração, resistente a fotos com flash e muita festa.',
      price: 180,
      duration: 60,
    },
    {
      name: 'Maquiagem para Eventos',
      slug: 'maquiagem-eventos',
      description: 'Produção glamourosa com olhos marcantes e contorno iluminado para festas noturnas e galas.',
      price: 200,
      duration: 75,
    },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: {
        name: service.name,
        description: service.description,
        price: service.price,
        duration: service.duration,
        active: true,
      },
      create: {
        ...service,
        active: true,
      },
    });
  }

  // Deactivate any legacy service not in the standardized 4
  await prisma.service.updateMany({
    where: {
      slug: { notIn: services.map((s) => s.slug) },
    },
    data: {
      active: false,
    },
  });

  console.log('Services created / synchronized:', services.length);

  // Create or update availability without deleting production records.
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
    const existing = await prisma.availability.findFirst({
      where: { dayOfWeek: avail.dayOfWeek },
    });

    if (existing) {
      await prisma.availability.update({ where: { id: existing.id }, data: avail });
    } else {
      await prisma.availability.create({ data: avail });
    }
  }

  console.log('Availability created:', availabilityData.length);

  // Create a test client
  const clientPassword = await argon2.hash(getSeedValue('SEED_CLIENT_PASSWORD', 'Client@123'), {
    type: argon2.argon2id,
  });

  const client = await prisma.user.upsert({
    where: { email: getSeedValue('SEED_CLIENT_EMAIL', 'cliente@teste.com') },
    update: {},
    create: {
      email: getSeedValue('SEED_CLIENT_EMAIL', 'cliente@teste.com'),
      name: getSeedValue('SEED_CLIENT_NAME', 'Maria Silva'),
      phone: getSeedValue('SEED_CLIENT_PHONE', '+5511999998888'),
      password: clientPassword,
      role: 'CLIENT',
      profile: {
        create: {
          preferences: {},
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
