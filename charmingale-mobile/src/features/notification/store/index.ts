import { create } from "zustand";
import { NotificationStore } from "../types";
import { BASE_URL } from "@/constant";
import { ApiResponse } from "@/@types";



export const useNotificationStore = create<NotificationStore>((set) => ({

    loadingNotification: false,
    notification: [],
    getNotification: async () => {


        set({ loadingNotification: true  });

        try {

            const res = await fetch(`${BASE_URL}/api/notification/get-notification`, { method: "GET" });
            const data: ApiResponse  = await res.json();
            if(!res.ok || !data.success ) throw new Error(data.message);
            
            if(data.success) set({ notification: data.data ?? [] })
            
                
        } catch (error) {
            console.log(`Error: ${ error instanceof Error && error.message }`);
        } finally {
            set({ loadingNotification: false });
        }
    }

}))