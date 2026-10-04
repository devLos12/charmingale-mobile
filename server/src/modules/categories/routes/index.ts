import { Router } from "express";

import GetCategories from "../controller/get-categories";
import GetCategoryTopic from "../controller/get-categories-topic";
import GetConceptDetails from "../controller/get-concept-details";
import { markConceptTopicCompleted, pauseRemainingSecond } from "../controller/update-concept-topic";
import requireAuth from "@/middleware/authenticate";




const categoriesRouter = Router();

categoriesRouter.get('/get-categories', requireAuth,  GetCategories);
categoriesRouter.get('/get-category-topics/:colorName', requireAuth, GetCategoryTopic);
categoriesRouter.get('/get-concept-details/:conceptId', requireAuth, GetConceptDetails); 
categoriesRouter.patch('/mark-completed/:conceptId', requireAuth, markConceptTopicCompleted);
categoriesRouter.patch('/pause-remaining-seconds', requireAuth, pauseRemainingSecond); 


export default categoriesRouter;