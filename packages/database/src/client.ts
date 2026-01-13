import { PrismaClient } from "@prisma/client"

const globalPrisma = globalThis as unknown as {
  prisma?: PrismaClient
}

export const prisma =
  new globalForPrisma.prisma() ??
  new PrismaClient({
    log: ["queryObjects", "error", "warn"],
  })

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}
