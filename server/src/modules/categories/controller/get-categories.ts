import { HTTPSTATUS } from "@/common/http-code";
import { prisma } from "@/lib/prisma";
import type { Request, Response } from "express";




const GetCategories = async (req: Request, res: Response) => {

    try {
        
        const rows = await prisma.pnleConcept.findMany({
            select: {
                categoryColorName: true,
                categoryColorHex: true,
                categoryName: true,
                categoryOrder: true,
                completed: true,
            }
        });

        
        const map = new Map <string, {
            colorName: string;
            colorHex: string;
            categoryName: string;
            order: number;
            topicTotal: number;
            topicDone: number;
            completed: boolean;
        }>();



        for(const row of rows) {

            const existing = map.get(row.categoryName);

            if(existing){
                existing.topicTotal += 1;
                if(row.completed) existing.topicDone += 1;
            } else {

                map.set(row.categoryName, {
                    colorName: row.categoryColorName,
                    colorHex: row.categoryColorHex,
                    categoryName: row.categoryName,
                    order: row.categoryOrder,
                    topicTotal: 1,
                    topicDone: row.completed ? 1 : 0,
                    completed: false
                });
            }
        }
        

        const categories = Array.from(map.values())
        .sort((a, b) => a.order - b.order )
        .map((c) => ({ ...c, completed: c.topicTotal > 0 && c.topicDone === c.topicTotal }));


        res.status(HTTPSTATUS.OK).json({
            success: true,
            message: 'get all categories',
            data: categories
        });

    } catch (error) {
        
        res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal Server Error"
        });

        console.log(`Error: ${error instanceof Error && error.message }`)
    }
}



export default GetCategories;