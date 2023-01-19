/* eslint-disable @typescript-eslint/no-var-requires */
const { PrismaClient } = require('@prisma/client');
const { regulators } = require('./regulators');

const prisma = new PrismaClient();

async function main() {
  for (const regulator of regulators) {
    await prisma.regulator.upsert({
      where: { name: regulator.name },
      update: {},
      create: {
        domain: regulator.domain,
        name: regulator.name,
        apiKeys: {
          create: [
            {
              key: regulator.apiKey,
            },
          ],
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
