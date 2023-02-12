//seed email whitelist
import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  //create table and product and then create transaction using faker
  for (let i = 0; i < 10; i++) {
    await prisma.table.create({
      data: {
        number: faker.random.numeric(2),
      },
    });

    await prisma.menu.create({
      data: {
        name: faker.commerce.productName(),
        price: faker.commerce.price(),
        desc: faker.commerce.productDescription(),
      },
    });
  }
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
