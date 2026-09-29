import 'dotenv/config'
import { PrismaClient } from '@/generated/prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'

import { config } from '@/config';


const connectionString = config.DATABASE_URL;

const adapter = new PrismaNeon({ connectionString });
export const prisma = new PrismaClient({ adapter });

