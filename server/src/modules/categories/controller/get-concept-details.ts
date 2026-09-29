

import { HTTPSTATUS } from "@/common/http-code";
import { prisma } from "@/lib/prisma";
import type { Request, Response } from "express"



const GetConceptDetails = async( req: Request, res: Response ) => {


    try {
        
        const { conceptId } = req.params;
        
        const conceptDetails = await prisma.pnleConcept.findUnique({
            where: { id: Number(conceptId) }
        });


        
        if(!conceptDetails){
            return res.status(HTTPSTATUS.NOT_FOUND).json({
                success: false,
                message: "Not found."
            });
        }

        res.status(HTTPSTATUS.OK).json({
            success: true,
            message: "Concept details successfully fetched.",
            data: conceptDetails
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