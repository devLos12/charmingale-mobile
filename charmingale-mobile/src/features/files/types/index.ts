
export type ConceptFile = {
  id: number;
  conceptId: number;
  originalName: string;
  storedFilename: string;
  mimeType: string;
  sizeBytes: number;
  uploadedAt: string;
};


export type MaterialsSectionProps = {
  conceptId: number;
  onPressFile?: (file: ConceptFile) => void;
};


export type UploadFileButtonProps = {
  conceptId: number;
  onUploaded?: () => void;
};


export interface FileTypeProps {
  uri: string;  
  name: string;  
  mimeType: string
}


export interface FilesStore {
  filesByConcept: Record<string, ConceptFile[]>;
  loadingByConcept: Record<string, boolean>;
  getConceptFiles: (conceptId: number ) => Promise<void>;
}






export type DeleteConfirmModalProps = {
  visible: boolean;
  fileName: string;
  loading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};
