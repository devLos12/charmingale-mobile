import { ApiResponse } from "@/@types";
import { BASE_URL } from "@/constant";
import { useCategoryStore } from "../store";
import { getToken } from "@/lib/google";





const authHeader = async () => {
    const token = await getToken();
    return { Authorization: `Bearer ${token}` };
};



export const useUpdateConcept = () => {


    const markConceptTopicCompleted = async( conceptId: number ): Promise<boolean> => {


        useCategoryStore.setState((state) => ({
            conceptDetails: state.conceptDetails
                ? {
                    ...state.conceptDetails,
                    completed: true,
                    completedAt: new Date().toISOString(),
                    remainingSeconds: 0,
                    running: false,
                }
                : null,
            
            categoryTopics: state.categoryTopics.map((c) => 
                c.id === conceptId
                    ? { ...c, completed: true, remainingSeconds: 0 }
                    : c
            )
        }));


        try {

            const id = String(conceptId);
            const res = await fetch(`${BASE_URL}/api/categories/mark-completed/${id}`, {
                method: "PATCH",
                headers: await authHeader()
            });

            const data: ApiResponse = await res.json();
            if(!res.ok || !data.success) throw new Error(data.message);
            if(data.success) return true

        } catch (error) {
            console.log(`Error: ${error instanceof Error && error.message}`);
        }

        
        return false;

    }


    const pauseRemainingSecond = async (
        conceptId: number,
        remainingSec: number
    ): Promise<boolean> => {  




        useCategoryStore.setState((state) => ({
            conceptDetails: state.conceptDetails
                ? {
                    ...state.conceptDetails,
                    remainingSeconds: remainingSec,
                    pauseCount: state.conceptDetails.pauseCount + 1,
                }
                : null,
        }));


        try {
            
            const res = await fetch(`${BASE_URL}/api/categories/pause-remaining-seconds`, {
                method: "PATCH",
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await getToken()}`
                },

                body: JSON.stringify({ conceptId, remainingSec })
            });

                        
            const data: ApiResponse = await res.json();            
            if(!res.ok || !data.success) throw new Error(data.message);
            if(data.success) return true


        } catch (error) {
            console.log(`Error: ${error instanceof Error && error.message}`)
        } 

        return false
    }


    return { markConceptTopicCompleted, pauseRemainingSecond  };

}