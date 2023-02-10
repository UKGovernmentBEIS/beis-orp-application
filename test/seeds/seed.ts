import { PrismaClient } from '@prisma/client';
import { regulators } from './regulators';

const prisma = new PrismaClient();

async function main() {
  for (const regulator of regulators) {
    await prisma.regulator.upsert({
      where: { name: regulator.name },
      update: {},
      create: {
        domain: regulator.domain,
        name: regulator.name,
      },
    });
  }
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
