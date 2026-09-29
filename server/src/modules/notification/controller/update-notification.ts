import { HTTPSTATUS } from "@/common/http-code"
import { prisma } from "@/lib/prisma";
import type { Request, Response } from "express"





const updateNotification = async (req: Request, res: Response) => {

    try {

        const { notifId } = req.params;
        const id = Number(notifId);
        
        await prisma.notification.update({
            where: { id },
            data: { read: true },
        })        

        res.status(HTTPSTATUS.OK).json({
            success: true,
            message: "Updated successfully.",
        });

    } catch (error) {
        
        res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
            success: false, 
            message: "Internal Server Error"
        });
    }
}


export default updateNotification;
