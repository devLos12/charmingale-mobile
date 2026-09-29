
import { Router } from "express";
import getDashboardStats from "../components/get-dashboard-topics";


const dashboardRouter = Router();
dashboardRouter.get('/dashboard-stats', getDashboardStats);
export default dashboardRouter;