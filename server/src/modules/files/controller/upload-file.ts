

import { HTTPSTATUS } from "@/common/http-code";
import { cloudinary } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import type { Request, Response } from "express"





const uploadFiles = async( req: Request, res: Response ) => {



    try {
        const { conceptId } = req.params;
        const file = req.file as Express.Multer.File;

        const id = Number(conceptId);


        if(!file) { 
            return res.status(HTTPSTATUS.BAD_REQUEST).json({
                success: false,
                message: "No file uploaded"
            })
        }


        const uploadResult = await new Promise<any>((resolve, reject) => {

            const steam = cloudinary.uploader.upload_stream(
                
                {
                    resource_type: 'raw',
                    folder: 'charmingale/concept-files',
                    public_id: `${Date.now()}-${file.originalname}`,
                },

                (error, result) => { 
                    if(error) return reject(error);
                    resolve(result);
                }
            )

            steam.end(file.buffer);
        });

        const savedFile = await prisma.file.create({
            data: {
                userId: req.userId,
                conceptId: id,
                originalName: file.originalname,
                storedFilename: uploadResult.secure_url,
                mimeType: file.mimetype,
                sizeBytes: file.size,
            }
        });
                    
        res.status(HTTPSTATUS.OK).json({
            success: true,
            message: 'Upload files successfully.',
            data: savedFile
        });
                

    } catch (error) {
        
        res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal Server Error"
        })
        
    }
}


export default uploadFiles;