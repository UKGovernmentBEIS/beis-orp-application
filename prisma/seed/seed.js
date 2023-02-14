/* eslint-disable @typescript-eslint/no-var-requires */
const { PrismaClient } = require('@prisma/client');
const { regulators } = require('./regulators');

const prisma = new PrismaClient();

async function main() {
  await prisma.regulator.deleteMany({});
  for (const regulator of regulators) {
    await prisma.regulator.create({
      data: {
        id: regulator.id,
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
