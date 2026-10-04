
import { Router } from "express";
import { HTTPSTATUS } from "@/common/http-code";
import type { Response, Request } from "express";
import categoriesRouter from "@/modules/categories/routes";
import filesRouter from "@/modules/files/routes";
import dashboardRouter from "@/modules/dashboard/routes";
import notifRouter from "@/modules/notification/routes";
import authRouter from "@/modules/auth/routes";




const indexRouter = Router();


indexRouter.get('/', (req: Request, res: Response) => {
    res.status(HTTPSTATUS.OK).json({
        message: 'API is live',
        status: 'ok',
        version: '1.0.0',
        developer: 'Carlos Loyola',
        timestamp: new Date().toISOString(),
    });
});

indexRouter.use('/categories', categoriesRouter);
indexRouter.use('/files', filesRouter);
indexRouter.use('/dashboard', dashboardRouter);
indexRouter.use('/notification', notifRouter);
indexRouter.use('/auth', authRouter);

export default indexRouter;









