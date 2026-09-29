// components/files/UploadFileButton.tsx
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { useUploadFile } from '../hooks/useUploadFile';
import { UploadFileButtonProps } from '../types';






const UploadFileButton = ({ conceptId, onUploaded }: UploadFileButtonProps) => {
  const { uploadFile, uploading } = useUploadFile();



  const handlePick = async () => {


    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/pdf',
      copyToCacheDirectory: true,
    });

    if (result.canceled) return;
    
    const picked = result.assets[0];

    const filePayload = { 
      uri: picked.uri,
      name: picked.name,
      mimeType: picked.mimeType ?? 'application/pdf',
    }

    const uploaded = await uploadFile(conceptId, filePayload);
    
    if (uploaded) {
      onUploaded?.();
    }

  };

  return (
    <TouchableOpacity
      onPress={handlePick}
      disabled={uploading}
      className={`flex-row items-center justify-center gap-2 border border-rose/30 rounded-xl py-3 mt-2 ${
        uploading ? 'opacity-50' : ''
      }`}
    >
      {uploading ? (
        <ActivityIndicator size="small" color="#C6415A" />
      ) : (
        <Feather name="upload" size={16} color="#C6415A" />
      )}
      <Text className="text-rose text-sm font-medium">
        {uploading ? 'Uploading...' : 'Upload material'}
      </Text>
    </TouchableOpacity>
  );
};

export default UploadFileButton;