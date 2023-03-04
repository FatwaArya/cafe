import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

import {
  cashierProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "../trpc";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "../../s3";
import {
  CopyObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

export const cashierRouter = createTRPCRouter({
  getsMenu: cashierProcedure.query(async ({ ctx }) => {
    const products = await ctx.prisma.menu.findMany();
    return products;
  }),
  getsTable: cashierProcedure.query(async ({ ctx }) => {
    //get all available tables
    const tables = await ctx.prisma.table.findMany({
      where: {
        status: "AVAILABLE",
      },
    });

    return tables;
  }),
  getTransaction: cashierProcedure.query(async ({ ctx }) => {
    const transactions = await ctx.prisma.transactionDetail.findMany({
      where: {
        transaction: {
          some: {
            userId: ctx.session.user.id,
          },
        },
      },

      include: {
        transaction: {
          select: {
            id: true,
            quantity: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return transactions;
  }),
  getDetailTransactionById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { id } = input;
      const transaction = await ctx.prisma.transactionDetail.findUnique({
        where: {
          id,
        },
        include: {
          transaction: {
            select: {
              id: true,
              quantity: true,
              customerName: true,
              status: true,
              menu: {
                select: {
                  name: true,
                  price: true,
                  image: true,
                  desc: true,
                },
              },
            },
          },
        },
      });
      return transaction;
    }),
  createOrder: cashierProcedure
    .input(
      z.object({
        customerName: z.string(),
        customerCash: z.number(),
        tableId: z.string(),
        total: z.number(),
        items: z.array(
          z.object({
            menuId: z.string(),
            quantity: z.number(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { customerName, tableId, items, total } = input;
      const transactionNumber = `${"order-" + uuidv4().slice(0, 8)}`;
      if (input.customerCash < total) {
        throw new Error("Customer cash is not enough");
      }

      let userChange = input.customerCash - total;
      const { id } = await ctx.prisma.transactionDetail.create({
        data: {
          transactionNumber,
          total,
          userCash: input.customerCash,
          userChange,
        },
      });

      items.forEach(async (item) => {
        await ctx.prisma.$transaction([
          ctx.prisma.transaction.create({
            data: {
              customerName,
              tableId,
              menuId: item.menuId,
              userId: ctx.session.user.id,
              quantity: item.quantity,
              transactionDetailId: id,
              status: "PAID",
            },
          }),

          ctx.prisma.table.update({
            where: {
              id: tableId,
            },
            data: {
              status: "OCCUPIED",
            },
          }),
        ]);
      });

      return userChange;
    }),
  updateProfile: cashierProcedure
    .input(
      z.object({
        name: z.string().min(1),
        files: z
          .array(
            z.object({
              key: z.string().min(1),
              ext: z.string().min(1),
            })
          )
          .min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { name, files } = input;

      for (const upload of files!) {
        const uuid = uuidv4();
        const menuName = uuid + "." + upload.ext;
        const url = await s3Client.send(
          new CopyObjectCommand({
            Bucket: "wiku-menu-item",
            CopySource: "wiku-menu-item/" + upload.key,
            Key: menuName,
            ACL: "public-read",
          })
        );

        await s3Client.send(
          new DeleteObjectCommand({
            Bucket: "wiku-menu-item",
            Key: upload.key,
          })
        );

        const object = await s3Client.send(
          new GetObjectCommand({
            Bucket: "wiku-menu-item",
            Key: menuName,
          })
        );

        await ctx.prisma.user.update({
          where: {
            id: ctx.session.user.id,
          },
          data: {
            name,
            image:
              "https://wiku-menu-item.sgp1.digitaloceanspaces.com/" + menuName,
          },
        });
      }
    }),
  createPresignedUrl: cashierProcedure
    .input(z.object({ count: z.number().gte(1).lte(4) }))
    .query(async ({ input }) => {
      const urls = [];

      for (let i = 0; i < input.count; i++) {
        const key = uuidv4();

        const url = await getSignedUrl(
          s3Client,
          new PutObjectCommand({
            Bucket: "wiku-menu-item",
            Key: key,
          })
        );

        urls.push({
          url,
          key,
        });
      }
      return urls;
    }),
});
