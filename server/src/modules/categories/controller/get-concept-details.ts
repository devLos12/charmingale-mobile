import { HTTPSTATUS } from "@/common/http-code";
import { prisma } from "@/lib/prisma";
import type { Request, Response } from "express"



const GetConceptDetails = async( req: Request, res: Response ) => {


    try {
        
        const { conceptId } = req.params;
        const userId = req.userId;
        
        const conceptDetails = await prisma.pnleConcept.findUnique({
            where: { id: Number(conceptId) },
            include: {
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
            },
        });


        
        if(!conceptDetails){
            return res.status(HTTPSTATUS.NOT_FOUND).json({
                success: false,
                message: "Not found."
            });
        }

        // i-flatten para pareho pa rin ang shape sa mobile (ConceptDetail)
        const { progress, ...concept } = conceptDetails;
        const p = progress[0];

        const data = {
            ...concept,
            completed: p?.completed ?? false,
            remainingSeconds: p?.remainingSeconds ?? null,
            running: p?.running ?? false,
            pauseCount: p?.pauseCount ?? 0,
            completedAt: p?.completedAt ?? null,
        };

        res.status(HTTPSTATUS.OK).json({
            success: true,
            message: "Concept details successfully fetched.",
            data
        });
        

    } catch (error) {

        res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Internal Server Error'
        });

        console.log(`Error: ${error instanceof Error && error.message}`);
    }
}

export default GetConceptDetails;