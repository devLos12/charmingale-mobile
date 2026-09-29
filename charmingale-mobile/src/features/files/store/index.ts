import { create } from 'zustand';
import { FilesStore } from '../types';
import { ApiResponse } from '@/@types';
import { BASE_URL } from '@/constant';

export const useFilesStore = create<FilesStore>((set) => ({

    filesByConcept: {},
    loadingByConcept: {},
    isLoading: false,

    getConceptFiles: async (conceptId) => {

        set((state) => ({
            loadingByConcept: { ...state.loadingByConcept, [conceptId]: true },
        }));

        try {

            const res = await fetch(`${BASE_URL}/api/files/get-concept-files/${conceptId}`, { method: "GET" });

            const data: ApiResponse = await res.json();
            if (!res.ok || !data.success) throw new Error(data.message);

            set((state) => ({
                filesByConcept: { ...state.filesByConcept, [conceptId]: data.data ?? [] },
            }));

        } catch (error) {
            console.log(`Error: ${error instanceof Error && error.message}`);
            
        } finally {

            set((state) => ({
                loadingByConcept: { ...state.loadingByConcept, [conceptId]: false },
            }));
        }
    },


}));