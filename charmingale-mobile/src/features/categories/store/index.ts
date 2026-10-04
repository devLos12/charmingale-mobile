    import { create } from "zustand";
    import { CategoryStore } from "../types";
    import { BASE_URL } from "@/constant";
    import { ApiResponse } from "@/@types";
    import { getToken } from "@/lib/google";


    const authHeader = async () => {
        const token = await getToken();
        return { Authorization: `Bearer ${token}` };
    };
    
    

    export const useCategoryStore = create<CategoryStore>((set) => ({

        loading: {
            isCategory: false,
            isCategoryTopic: false,
            isConceptDetails: false
        },

        isRefreshCategory: false,
        categories: [],
        getCategories: async () => {

            set((state) => ({ loading: { ...state.loading, isCategory: true }}));
            
            try {
                
                const res = await fetch(`${BASE_URL}/api/categories/get-categories`, {
                    method: "GET",
                    headers: await authHeader()
                });

                const data: ApiResponse = await res.json();

                if(!res.ok || !data.success) throw new Error(data.message);

                if(data.success){
                    set({ categories: data.data ?? [] });
                }
                

            } catch (error) {
                console.log(`Error: ${error instanceof Error && error.message}`)
            } finally {
                set((state) => ({ loading: { ...state.loading, isCategory: false }}));
            }
        },



        
        categoryTopics: [],
        getCategoryTopics: async (colorName) => {
            
            if(colorName){
                set((state) => ({ loading: { ...state.loading, isCategoryTopic: true }}));
            }

            try {

                const res = await fetch(`${BASE_URL}/api/categories/get-category-topics/${colorName}`, {
                    method: "GET",
                    headers: await authHeader()
                });
                
                const data: ApiResponse = await res.json();
                if(!res.ok || !data.success ) throw new Error(data.message);

                if(data.success){
                    set({ categoryTopics: data.data ?? [] });
                }


            } catch (error) {
                console.log(`Error: ${error instanceof Error && error.message}`)
            }finally {
                set((state) => ({ loading: { ...state.loading, isCategoryTopic: false }}));

            }
        },

        
        conceptDetails: null,
        getConceptDetails: async(conceptId) => {

            if(conceptId){
                set((state) => ({ loading: { ...state.loading, isConceptDetails: true }}));
            }

                            
            try {
                const res = await fetch(`${BASE_URL}/api/categories/get-concept-details/${conceptId}`, {
                    method: "GET",
                    headers: await authHeader()
                });

                const data: ApiResponse = await res.json();
                if(!res.ok || !data.success) throw new Error(data.message);
                
                if(data.success){
                    set({ conceptDetails: data.data ?? null });
                };

            } catch (error) {
                console.log(`Error: ${error instanceof Error && error.message }`);
            } finally {
                set((state) => ({ loading: { ...state.loading, isConceptDetails: false }}));

            }
        }

    }));