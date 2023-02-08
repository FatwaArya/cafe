//seed email whitelist

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = await prisma.whitelistEmail.create({
    data: {
      email: "fatwastaruz@gmail.com",
    },
  });
  console.log({ email });
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
