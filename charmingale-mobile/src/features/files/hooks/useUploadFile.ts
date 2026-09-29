// hooks/useUploadFile.ts
import { ApiResponse } from "@/@types";
import { BASE_URL } from "@/constant";
import { useState } from "react";
import { FileTypeProps } from "../types";
import ReactNativeBlobUtil from "react-native-blob-util";



export const useUploadFile = () => {

    const [uploading, setUploading] = useState(false);

    const uploadFile = async ( conceptId: number, file: FileTypeProps ) => {

        setUploading(true);



        try {
            const response = await ReactNativeBlobUtil.fetch(
                'POST',
                `${BASE_URL}/api/files/upload-file/${conceptId}`,
                {
                    'Content-Type': 'multipart/form-data',
                },
                [
                    {
                        name: 'file',
                        filename: file.name,
                        type: file.mimeType,
                        data: ReactNativeBlobUtil.wrap(file.uri.replace('file://', '')),
                    },
                ]
            );

            const data: ApiResponse = JSON.parse(response.data);
            if (!response.respInfo.status || response.respInfo.status >= 400 || !data.success) {
                throw new Error(data.message);
            }

            return data.data;

        } catch (error) {
            console.log(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
            return null;

        } finally {
            setUploading(false);
        }
    };

    return { uploadFile, uploading };
};