
import { Router } from "express";
import getDashboardStats from "../components/get-dashboard-topics";
import requireAuth from "@/middleware/authenticate";


const dashboardRouter = Router();
dashboardRouter.get('/dashboard-stats', requireAuth, getDashboardStats);
export default dashboardRouter;