import { PrismaClient } from '@prisma/client';
import { regulators, users } from './regulators';

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
  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        email: user.email,
        regulator: {
          connect: user.domain ? { domain: user.domain } : undefined,
        },
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
