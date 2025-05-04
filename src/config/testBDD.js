// src/config/testBDD.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function testBDD() {
  try {
    const now = await prisma.$queryRaw`SELECT now()`;
    console.log('✔️  PostgreSQL is up —', now);
  } catch (err) {
    console.error('❌  Impossible de se connecter à la BDD :', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}
