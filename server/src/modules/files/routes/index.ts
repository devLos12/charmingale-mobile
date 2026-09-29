
import { Router } from "express";
import uploadFiles from "../controller/upload-file";
import { upload } from "@/middleware/upload";
import getConceptFiles from "../controller/get-concept-files";
import { deleteFile } from "../controller/delete-file";




const filesRouter = Router();

filesRouter.post('/upload-file/:conceptId', upload.single('file'), uploadFiles);
filesRouter.get('/get-concept-files/:conceptId', getConceptFiles);
filesRouter.delete('/delete-file', deleteFile);


export default filesRouter;

