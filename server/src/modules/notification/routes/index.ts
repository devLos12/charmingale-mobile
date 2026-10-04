import { Router } from "express";
import requireAuth from "@/middleware/authenticate";
import pushRegister from "../controller/push-register";
import getNotification from "../controller/get-notification";
import updateNotification  from "../controller/update-notification";



const notifRouter = Router();

notifRouter.post('/push-register', requireAuth, pushRegister); 
notifRouter.get('/get-notification', requireAuth, getNotification);
notifRouter.patch('/update-notification/:notifId', requireAuth, updateNotification);


export default notifRouter;
