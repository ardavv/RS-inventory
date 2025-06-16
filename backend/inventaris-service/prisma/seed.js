const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.category.create({
    data: {
      categoryName: 'Alat Medis' // bebas, misalnya
    }
  });
  console.log('Category seeded');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
  });
