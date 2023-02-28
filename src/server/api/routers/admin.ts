import { z } from "zod";
import { adminProcedure, createTRPCRouter } from "../trpc";
import { s3Client } from "./../../s3";
import {
  CopyObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import probe from "probe-image-size";
import type { Readable } from "stream";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { TRPCError } from "@trpc/server";
import { createTransport } from "nodemailer";
import { env } from "../../../env/server.mjs";

const transporter = createTransport({
  host: env.EMAIL_SERVER_HOST,
  port: parseInt(env.EMAIL_SERVER_PORT),
  auth: {
    user: env.EMAIL_SERVER_USER,
    pass: env.EMAIL_SERVER_PASSWORD,
  },
});

export const adminRouter = createTRPCRouter({
  getUsers: adminProcedure.query(async ({ ctx }) => {
    const users = await ctx.prisma.user.findMany({
      where: {
        role: {
          not: "ADMIN",
        },
      },
    });
    return users;
  }),
  whitelistUser: adminProcedure
    .input(
      z.object({
        email: z.string().email(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { email } = input;
      const user = await ctx.prisma.whitelistEmail.create({
        data: {
          email,
        },
      });
      transporter.sendMail({
        from: env.EMAIL_FROM,
        to: email,
        sender: env.EMAIL_SERVER_USER,
        subject: "Welcome to Wiku Cafe",
        text: `Welcome to Wiku Cafe, your email has been whitelisted. You can now sign in to the app with your email.`,
      });

      return user;
    }),
  getWhitelist: adminProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.whitelistEmail.findMany();
  }),
  getUserById: adminProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { id } = input;
      const user = await ctx.prisma.user.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          name: true,
          role: true,
        },
      });
      return user;
    }),
  updateRole: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        role: z.enum(["MANAGER", "CASHIER", "ADMIN"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, role } = input;
      const user = await ctx.prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          role: true,
        },
      });
      //cant change the same role
      if (user?.role === role) {
        throw new Error("cant change the same role");
      }

      await ctx.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          role: role,
        },
      });
    }),
  deleteWhitelist: adminProcedure
    .input(
      z.object({
        email: z.string().email(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { email } = input;
      await ctx.prisma.whitelistEmail.delete({
        where: {
          email,
        },
      });
    }),
  createMenu: adminProcedure
    .input(
      z.object({
        name: z.string().min(1),
        menuPrice: z.string().min(1),
        menuDescription: z.string().min(1),
        menuType: z.enum(["FOOD", "BEVERAGE"]),
        files: z
          .array(
            z.object({
              key: z.string().min(1),
              ext: z.string().min(1),
            })
          )
          .max(4),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { menuPrice, name, menuDescription, menuType } = input;
      const files = input.files;
      for (const upload of files) {
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

        // const fileType = await probe(object.Body as Readable);

        // if (
        //   !object.ContentLength ||
        //   !fileType ||
        //   upload.ext !== fileType.type
        // ) {
        //   throw new TRPCError({
        //     code: "BAD_REQUEST",
        //     message: "Invalid file uploaded.",
        //   });
        // }
        //todo
        await ctx.prisma.menu.create({
          data: {
            name: name,
            price: menuPrice,
            desc: menuDescription,
            type: menuType,
            image:
              "https://wiku-menu-item.sgp1.digitaloceanspaces.com/" + menuName,
          },
        });
      }
    }),
  createPresignedUrl: adminProcedure
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
  getTables: adminProcedure.query(async ({ ctx }) => {
    const tables = await ctx.prisma.table.findMany();
    return tables;
  }),
  setAllTablesAvailable: adminProcedure.mutation(async ({ ctx }) => {
    await ctx.prisma.table.updateMany({
      where: {
        status: "OCCUPIED",
      },
      data: {
        status: "AVAILABLE",
      },
    });
  }),
  setTableToAvailable: adminProcedure
    .input(
      z.object({
        tableId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { tableId } = input;
      await ctx.prisma.table.update({
        where: {
          id: tableId,
        },
        data: {
          status: "AVAILABLE",
        },
      });
    }),
});
