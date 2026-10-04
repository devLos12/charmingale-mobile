import { ApiResponse } from "@/@types";
import { BASE_URL } from "@/constant";
import { getToken } from "@/lib/google";
import { useState } from "react";
import { useFilesStore } from "../store";



export const useDeleteFile = () => {

    const [loadingDelete, setLoadingDelete] = useState(false);
    const { filesByConcept } = useFilesStore();    




    const deleteFile = async (

        conceptId: number,
        deleteId: number,
        
    ): Promise<boolean> => {

        setLoadingDelete(true);


        try {
            
            const res = await fetch(`${BASE_URL}/api/files/delete-file`, { 
                method: "DELETE", 
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${await getToken()}`,
                },
                body: JSON.stringify({ conceptId, deleteId })
            });


            const data: ApiResponse = await res.json();
            if(!res.ok || !data.success ) throw new Error(data.message);

            if(data.success) return true

        } catch (error) {
            console.log(`Error: ${ error instanceof Error && error.message }`);
            
        } finally {
            setLoadingDelete(false);
        }
        

        return false

    }


    return { deleteFile, loadingDelete };
}


