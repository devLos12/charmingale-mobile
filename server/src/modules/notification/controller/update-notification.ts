import { HTTPSTATUS } from "@/common/http-code"
import { prisma } from "@/lib/prisma";
import type { Request, Response } from "express"



const updateNotification = async (req: Request, res: Response) => {

    try {

        const { notifId } = req.params;
        const id = Number(notifId);
        
        const result = await prisma.notification.updateMany({
            where: { id, userId: req.userId },
            data: { read: true },
        });

        if (result.count === 0) {
            return res.status(HTTPSTATUS.NOT_FOUND).json({
                success: false,
                message: "Notification not found.",
            });
        }

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
