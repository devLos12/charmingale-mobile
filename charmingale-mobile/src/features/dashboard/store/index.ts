import { create } from 'zustand';
import { DashboardData, DashboardStats } from '../types';
import { BASE_URL } from '@/constant';
import { ApiResponse } from '@/@types';
import { getToken } from '@/lib/google';


const authHeader = async () => {
    const token = await getToken();
    return { Authorization: `Bearer ${token}` };
};


export const useDashboardStore = create<DashboardStats>((set) => ({ 

    totalTopics: 0,
    completedTopics: 0,
    isLoading: false,
    totalStudiedSeconds: 0,
    streakCounts: 0,
    name: "",    

    getDashboardStats: async () => {


        set({ isLoading: true });

        try {  

            const res = await fetch(`${BASE_URL}/api/dashboard/dashboard-stats`, {
                method: 'GET',
                headers: await authHeader()
            });

            const data: ApiResponse<DashboardData> = await res.json();
            if(!res.ok || !data.success) throw new Error(data.message);

            if(data.success) set({ 
                totalTopics: data.data?.totalTopics,  
                completedTopics: data.data?.completedTopics,
                totalStudiedSeconds: data.data?.totalStudiedSeconds,
                streakCounts: data.data?.streakCounts,
                name: data.data?.name
            });

            

        } catch (error) {
            console.log(`Error: ${error instanceof Error && error.message}`);

        } finally {
            set({ isLoading: false });
        }
    },

}))