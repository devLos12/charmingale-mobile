import type { Request, Response } from "express";

import { prisma } from "@/lib/prisma";
import { HTTPSTATUS } from "@/common/http-code";




const getNotification = async ( req: Request, res: Response ) => {

    try {
        
        const notifications = await prisma.notification.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });

        res.status(HTTPSTATUS.OK).json({
            success: true,
            message: notifications.length === 0 ? "No notifications yet." : "Notifications fetched successfully.",
            data: notifications
        });


    } catch (error) {
        
        res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
}

export default getNotification;