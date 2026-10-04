
import { Router } from "express";
import requireAuth from "@/middleware/authenticate";
import uploadFiles from "../controller/upload-file";
import { upload } from "@/middleware/upload";
import getConceptFiles from "../controller/get-concept-files";
import { deleteFile } from "../controller/delete-file";




const filesRouter = Router();

filesRouter.post('/upload-file/:conceptId', requireAuth, upload.single('file'), uploadFiles);
filesRouter.get('/get-concept-files/:conceptId', requireAuth, getConceptFiles);
filesRouter.delete('/delete-file', requireAuth, deleteFile);


export default filesRouter;

