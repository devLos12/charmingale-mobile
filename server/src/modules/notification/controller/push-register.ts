
import { HTTPSTATUS } from "@/common/http-code";
import type { Request, Response  } from "express";
import { prisma } from "@/lib/prisma";




const pushRegister = async ( req: Request, res: Response ) => {

    try {
        
        const { token } = req.body;
        
        if (!token) {
            return res.status(HTTPSTATUS.BAD_REQUEST).json({
                success: false,
                message: "Token is required.",
            });
        }


        await prisma.deviceToken.upsert({
            where: { token: token },
            update: { userId: req.userId },
            create: { token: token, userId: req.userId },
        });
        
        return res.status(HTTPSTATUS.OK).json({
            success: true,
            message: "Device token registered.",
        });


    } catch (error) {

        console.log(`Error: ${error instanceof Error && error.message }`);

        res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Internal Server Error.'
        })
    }
    
}

export default pushRegister;