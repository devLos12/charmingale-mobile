

import { HTTPSTATUS } from "@/common/http-code"
import { prisma } from "@/lib/prisma";
import type { Request, Response } from "express"


const getConceptFiles = async(req: Request, res: Response ) => {
    

    try {
        const { conceptId } = req.params;
        const id = Number(conceptId);
        
        const conceptFiles = await prisma.file.findMany({
            where: { conceptId: id },
            orderBy: { uploadedAt: "desc" }
        });

        res.status(HTTPSTATUS.OK).json({
            success: true,
            message: conceptFiles.length === 0 ? "No files uploaded yet." : "Concept files retrieved successfully.",
            data: conceptFiles
        });

    } catch (error) {
        
        console.log(`Error: ${ error instanceof Error && error.message }`)
        
        res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Internal Server Error.',

        })
    }
}


export default getConceptFiles;