import { HTTPSTATUS } from "@/common/http-code";
import { prisma } from "@/lib/prisma";
import type { Request, Response } from "express";



const GetCategoryTopic = async (req: Request, res: Response ) => {

    try {
        
        const { colorName } = req.params;
        const userId = req.userId;

                
        const allCategoryTopics = await prisma.pnleConcept.findMany({

            where: {
                categoryColorName: colorName as string,
            },

            select: {
                id: true,
                groupLabel: true,
                topicHeader: true,
                topicOrder: true,

                conceptText: true,
                conceptOrder: true,      
                allocatedMinutes: true,

                progress: {
                    where: { userId },
                    select: {
                        completed: true,
                        remainingSeconds: true,
                        running: true,
                        pauseCount: true,
                        completedAt: true,
                    },
                },
            }
        });

        
        if(!allCategoryTopics || allCategoryTopics.length === 0){
            return res.status(HTTPSTATUS.NOT_FOUND).json({
                success: false,
                message: `${colorName} category not found.`
            })
        }

        // i-flatten para pareho pa rin ang shape sa mobile (CategoryTopics)
        const data = allCategoryTopics.map(({ progress, ...concept }) => {
            const p = progress[0];

            return {
                ...concept,
                completed: p?.completed ?? false,
                remainingSeconds: p?.remainingSeconds ?? null,
                running: p?.running ?? false,
                pauseCount: p?.pauseCount ?? 0,
                completedAt: p?.completedAt ?? null,
            };
        });

        res.status(HTTPSTATUS.OK).json({
            success: true,
            message: `${colorName} category successfully fetched.`,
            data
        });

    } catch (error) {
        
        res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal Server Error"
        })
        console.log(`Error: ${error instanceof Error && error.message }`);
    }
}

export default GetCategoryTopic;