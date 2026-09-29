import { HTTPSTATUS } from "@/common/http-code";
import { prisma } from "@/lib/prisma";
import type { Request, Response } from "express"




const getDashboardStats = async (req: Request, res: Response) => {

    try {

        const totalTopics = await prisma.pnleConcept.count();
        const completedTopics = await prisma.pnleConcept.count({
            where: { completed: true }
        });

        const touchedConcepts = await prisma.pnleConcept.findMany({
            where: {
                OR: [
                    { completed: true },
                    { remainingSeconds: { not: null } },
                ],
            },
            select: {
                allocatedMinutes: true,
                remainingSeconds: true,
                completed: true,
            },
        });

        const totalStudiedSeconds = touchedConcepts.reduce((acc, concept) => {
            const allocatedSeconds = concept.allocatedMinutes * 60;
            const elapsed = concept.completed
                ? allocatedSeconds
                : allocatedSeconds - (concept.remainingSeconds ?? allocatedSeconds);
            return acc + elapsed;
        }, 0);

        
        const streak = await prisma.streak.findFirst();


        res.status(HTTPSTATUS.OK).json({
            success: true,
            message: "Dashboard stats fetched successfully.",
            data: {
                totalTopics,
                completedTopics,
                totalStudiedSeconds,
                streakCounts: streak?.count ?? 0
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