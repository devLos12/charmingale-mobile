import { Router } from "express";
import pushRegister from "../controller/push-register";
import getNotification from "../controller/get-notification";
import updateNotification  from "../controller/update-notification";



const notifRouter = Router();

notifRouter.post('/push-register', pushRegister); 
notifRouter.get('/get-notification', getNotification);
notifRouter.patch('/update-notification/:notifId', updateNotification);


export default notifRouter;
