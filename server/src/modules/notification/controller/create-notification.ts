import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";


export const createNotification = async (data: Prisma.NotificationUncheckedCreateInput) => {
  return prisma.notification.create({ data });
};