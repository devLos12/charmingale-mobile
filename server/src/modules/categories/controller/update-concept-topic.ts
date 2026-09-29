
import { HTTPSTATUS } from "@/common/http-code"
import { prisma } from "@/lib/prisma";
import { updateStreak } from "@/lib/streak";
import type { Request, Response } from "express"

import { createNotification } from "@/modules/notification";
import { formatRemainingTime } from "@/lib/utils";



export const markConceptTopicCompleted = async(req: Request, res: Response ) => {


    try {

        const { conceptId } = req.params;
        const id = Number(conceptId);

        const topic = await prisma.pnleConcept.update({
            where: { id },
            data: {
                completed: true,
                completedAt: new Date(),
                remainingSeconds: 0,
                running: false,
            },
        });

        await updateStreak();

        await createNotification({
            title: 'Topic Completed! 🎉',
            body: `You finished "${topic.conceptText}". Great job!`,
            path: `/concept/${id}`,
        });

                
        res.status(HTTPSTATUS.OK).json({ 
            success: true,
            message: `Concept marked as completed successfully.`,
        });


    } catch (error) {
        console.log(`Error: ${error instanceof Error && error.message}`)
        res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Internal server error.'
        });

    }
}



export const pauseRemainingSecond = async(req: Request, res: Response ) => {

    try {

        const { conceptId, remainingSec } = req.body;
        const id = Number(conceptId);


        const existing = await prisma.pnleConcept.findUnique({
            where: { id }
        });

        if(!existing) {
            return res.status(HTTPSTATUS.NOT_FOUND).json({
                success: false,
                message: 'not found.'
            })
        }

        const topic = await prisma.pnleConcept.update({
            where: { id },
            data: { 
                remainingSeconds: remainingSec,
                pauseCount: { increment: 1 }
            }
        });

        await createNotification({
            title: 'topic paused',
            body: `you have ${formatRemainingTime(remainingSec)} in ${topic.conceptText}`,
            path: `/concept/${id}`,
        });
        

        res.status(HTTPSTATUS.OK).json({
            success: true,
            message: 'paused successfully.'
        });

    } catch (error) {

        res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Internal server error.'
        })
    }
}



