//seed email whitelist
import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.whitelistEmail.create({
    data: {
      email: "fatwaaryasatyaakbar@gmail.com",
    },
  });

  // for (let i = 0; i < 10; i++) {
  //   await prisma.table.create({
  //     data: {
  //       number: faker.random.numeric(2, { bannedDigits: ["0"] }),
  //     },
  //   });

  //   await prisma.menu.create({
  //     data: {
  //       name: faker.commerce.productName(),
  //       price: faker.finance.amount(10000, 100000, 2),
  //       desc: faker.commerce.productDescription(),
  //       image: faker.image.food(1234, 2345, true),
  //     },
  //   });
  // }
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
