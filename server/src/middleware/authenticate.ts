import { HTTPSTATUS } from "@/common/http-code";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";




const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;

    if (!header?.startsWith("Bearer ")) {
        return res.status(HTTPSTATUS.UNAUTHORIZED).json({
            success: false,
            message: "Missing token",
        });
    }

    try {
        const token = header.slice(7);
        const payload = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };

        req.userId = payload.userId;
        next();
    } catch (error) {
        return res.status(HTTPSTATUS.UNAUTHORIZED).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
};

export default requireAuth;