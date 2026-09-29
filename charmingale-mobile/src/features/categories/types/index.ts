

export interface Category {
    colorName: string;
    colorHex: string;
    categoryName: string;
    order: number;
    topicTotal: number;
    topicDone: number;
    isCompleted: boolean;
}




export interface CategoryTopics {
    id: number;
    groupLabel: string | null;
    topicHeader: string
    topicOrder: number

    conceptText: string
    conceptOrder: number
    allocatedMinutes: number

    completed:          boolean;   
    remainingSeconds:   number | null;
    running:            boolean;
    pauseCount:         number;
    completedAt:        string | null;
}




export interface ConceptDetail {
    id: number;
    
    // category info (para malaman "saan siya galing")
    categoryName: string;
    categoryColorHex: string;
    categoryColorName: string;

    // topic info
    groupLabel: string | null;
    topicHeader: string;
    topicOrder: number;

    // concept info
    conceptText: string;
    conceptOrder: number;
    allocatedMinutes: number;

    // progress/timer state
    completed: boolean;
    remainingSeconds: number | null;
    running: boolean;
    pauseCount: number;
    completedAt: string | null;

}

export interface ConceptFile {
    id: number;
    conceptId: number;
    originalName: string;
    storedFilename: string;
    mimeType: string;
    sizeBytes: number;
    uploadedAt: string;
}




export interface Loading {
    isCategory: boolean;
    isCategoryTopic: boolean;
    isConceptDetails: boolean;
}



export interface CategoryStore {

    loading: Loading;

    categories: Category[];
    getCategories: () => Promise<void>;
    isRefreshCategory: boolean;

    categoryTopics: CategoryTopics[]
    getCategoryTopics: (colorName: string) => Promise<void>;


    conceptDetails: ConceptDetail | null;
    getConceptDetails: (conceptId: number) => Promise<void>;

} 


export type CompletedModalProps = {
  visible: boolean;
  conceptText: string;
  allocatedMinutes: number;
  onClose: () => void;
};