import { HTTPSTATUS } from "@/common/http-code";
import { prisma } from "@/lib/prisma";
import type { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";



const client = new OAuth2Client(process.env.GOOGLE_WEB_CLIENT_ID);


const googleAuth = async (req: Request, res: Response) => {

    try {
        const { idToken } = req.body;


        if (!idToken) {
            return res.status(HTTPSTATUS.BAD_REQUEST).json({
                success: false,
                message: "idToken is required",
            });
        }

        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_WEB_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        

        if (!payload?.sub || !payload.email || !payload.email_verified) {
            return res.status(HTTPSTATUS.UNAUTHORIZED).json({
                success: false,
                message: "Invalid Google account",
            });
        }

        const user = await prisma.user.upsert({
            where: { email: payload.email },
            update: { googleId: payload.sub },
            create: {
                email: payload.email,
                googleId: payload.sub,
                name: payload.given_name,
            },
        });

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
            expiresIn: "30d",
        });
        
        
        res.status(HTTPSTATUS.OK).json({
            success: true,
            message: "signed in",
            data: {
                token,
                user: { id: user.id, email: user.email, name: user.name },
            },
        });

    } catch (error) {
        
        res.status(HTTPSTATUS.UNAUTHORIZED).json({
            success: false,
            message: "Google sign-in failed",
        });

        console.log(`Error: ${error instanceof Error && error.message}`);
    }
}

export default googleAuth;