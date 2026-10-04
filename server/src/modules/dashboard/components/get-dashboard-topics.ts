import { HTTPSTATUS } from "@/common/http-code";
import { prisma } from "@/lib/prisma";
import type { Request, Response } from "express"




const getDashboardStats = async (req: Request, res: Response) => {

    try {

        const userId = req.userId;

        // shared ang bilang ng topics, pareho para sa lahat
        const totalTopics = await prisma.pnleConcept.count();

        // individual na ang completed
        const completedTopics = await prisma.conceptProgress.count({
            where: { userId, completed: true }
        });

        const touchedConcepts = await prisma.conceptProgress.findMany({
            where: {
                userId,
                OR: [
                    { completed: true },
                    { remainingSeconds: { not: null } },
                ],
            },
            select: {
                completed: true,
                remainingSeconds: true,
                concept: {
                    select: { allocatedMinutes: true },
                },
            },

        });


        const totalStudiedSeconds = touchedConcepts.reduce((acc, progress) => {
            const allocatedSeconds = progress.concept.allocatedMinutes * 60;
            const elapsed = progress.completed
                ? allocatedSeconds
                : allocatedSeconds - (progress.remainingSeconds ?? allocatedSeconds);
            return acc + elapsed;
        }, 0);

                
        const streak = await prisma.streak.findUnique({ where: { userId } });


        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { 
                name: true 
            }
        })

        res.status(HTTPSTATUS.OK).json({
            success: true,
            message: "Dashboard stats fetched successfully.",
            data: {
                totalTopics,
                completedTopics,
                totalStudiedSeconds,
                streakCounts: streak?.count ?? 0,
                name: user?.name ?? null
            }
        });


    } catch (error) {
        console.log(`Error: ${error instanceof Error && error.message}`);
        res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

export default getDashboardStats;