import { Router } from "express";

import GetCategories from "../controller/get-categories";
import GetCategoryTopic from "../controller/get-categories-topic";
import GetConceptDetails from "../controller/get-concept-details";
import { markConceptTopicCompleted, pauseRemainingSecond } from "../controller/update-concept-topic";




const categoriesRouter = Router();

categoriesRouter.get('/get-categories', GetCategories);
categoriesRouter.get('/get-category-topics/:colorName', GetCategoryTopic);
categoriesRouter.get('/get-concept-details/:conceptId', GetConceptDetails); 
categoriesRouter.patch('/mark-completed/:conceptId', markConceptTopicCompleted);
categoriesRouter.patch('/pause-remaining-seconds', pauseRemainingSecond); 




export default categoriesRouter;