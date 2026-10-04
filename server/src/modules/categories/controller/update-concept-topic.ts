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
        const userId = req.userId;

        const topic = await prisma.pnleConcept.findUnique({
            where: { id },
        });

        if(!topic) {
            return res.status(HTTPSTATUS.NOT_FOUND).json({
                success: false,
                message: 'not found.'
            });
        }

        const done = {
            completed: true,
            completedAt: new Date(),
            remainingSeconds: 0,
            running: false,
        };

        await prisma.conceptProgress.upsert({
            where: { userId_conceptId: { userId, conceptId: id } },
            update: done,
            create: { userId, conceptId: id, ...done },
        });

        await updateStreak(userId);

        await createNotification({
            userId,
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
        const userId = req.userId;


        const topic = await prisma.pnleConcept.findUnique({
            where: { id }
        });

        if(!topic) {
            return res.status(HTTPSTATUS.NOT_FOUND).json({
                success: false,
                message: 'not found.'
            })
        }

        await prisma.conceptProgress.upsert({
            where: { userId_conceptId: { userId, conceptId: id } },
            update: {
                remainingSeconds: remainingSec,
                pauseCount: { increment: 1 },
            },
            create: {
                userId,
                conceptId: id,
                remainingSeconds: remainingSec,
                pauseCount: 1,
            },
        });

        await createNotification({
            userId,
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