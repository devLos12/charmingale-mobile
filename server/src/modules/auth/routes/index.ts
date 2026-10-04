import { Router } from "express";
import googleAuth from "../controller/google-auth";

const authRouter = Router();

authRouter.post('/google', googleAuth);

export default authRouter;