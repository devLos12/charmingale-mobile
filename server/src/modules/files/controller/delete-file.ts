

import { HTTPSTATUS } from "@/common/http-code"
import { prisma } from "@/lib/prisma";
import type { Request, Response } from "express"



export const deleteFile = async (req: Request, res: Response ) => {

    try {   

        const { conceptId, deleteId } = req.body;        


        const file = await prisma.file.findFirst({
            where: {
                id: Number(deleteId),
                conceptId: Number(conceptId)
            }
        })

        if(!file) {
            return res.status(HTTPSTATUS.NOT_FOUND).json({
                success: false,
                message: "File not found."
            })
        }


        await prisma.file.delete({
            where: { id: Number(deleteId)}
        });

        res.status(HTTPSTATUS.OK).json({
            success: true,
            message: "Deleted successfully."
        })

    } catch (error) {
        res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal Server Error."
        })
    }
}
