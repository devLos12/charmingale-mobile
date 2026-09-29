import { ApiResponse } from "@/@types";
import { BASE_URL } from "@/constant";
import { useState } from "react"




export const useUpdateNotification = () => {
    
    const [ loadingUpdate, setLoadingUpdate, ] = useState<boolean>(false);


    const updateNotification = async ( notifId: number ): Promise<boolean> => {

        setLoadingUpdate(true);

        try {
            
            const res = await fetch(`${BASE_URL}/api/notification/update-notification/${notifId}`,{ method: "PATCH" });
            const data: ApiResponse = await res.json();
            
            if(!res.ok || !data.success) throw new Error();
            if(data.success) return true;            

        } catch (error) {
            console.log(`Error: ${error instanceof Error && error.message }`);

        } finally {
            setLoadingUpdate(false);
        }


        return false
    }


    return { loadingUpdate, updateNotification };
}