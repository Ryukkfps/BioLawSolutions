import { PrismaClient } from "./prisma-client";

// Ensure we are using the custom generated client
export const prisma = new PrismaClient({
  log: ["query", "error", "warn"],
});

// Debug check for the Service model fields
if (process.env.NODE_ENV !== "production") {
  const globalForPrisma = global as unknown as { prisma: PrismaClient };
  
  // Force overwrite the global instance to ensure the new client is used in HMR
  globalForPrisma.prisma = prisma;
  
  // Try to inspect the model structure if possible
  try {
    const dmmf = (prisma as any)._dmmf;
    if (dmmf) {
      const serviceModel = dmmf.modelMap?.Service || dmmf.datamodel?.models.find((m: any) => m.name === 'Service');
      console.log('Service model fields in current Prisma instance:', serviceModel?.fields.map((f: any) => f.name));
    }
  } catch (e) {
    // Ignore inspection errors
  }
}
