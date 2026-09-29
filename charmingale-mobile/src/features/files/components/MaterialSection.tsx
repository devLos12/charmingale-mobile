import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { MaterialsSectionProps } from '../types';
import { useEffect, useState } from 'react';
import { useFilesStore } from '../store';
import { useDeleteFile } from '../hooks/useDeleteFile';
import { DeleteConfirmModal } from './DeleteConfirmModal';




const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const MaterialsSection = ({ conceptId, onPressFile }: MaterialsSectionProps) => {

  const { filesByConcept, loadingByConcept, getConceptFiles } = useFilesStore();
  const conceptFiles = filesByConcept[conceptId] ?? [];
  const isLoading = loadingByConcept[conceptId] ?? false;

  const { deleteFile, loadingDelete } = useDeleteFile();

  const [targetFile, setTargetFile] = useState<{ id: number; name: string } | null>(null);

  useEffect(() => {
    getConceptFiles(conceptId);
  }, [conceptId]);

  const handleConfirmDelete = async () => {
    if (!targetFile) return;
    const success = await deleteFile(conceptId, targetFile.id);

    if (success) getConceptFiles(conceptId) ;
    setTargetFile(null);
    
  };

  return (
    <View className="my-6">
      <Text className="text-ink text-sm font-semibold mb-3">
        Reading Materials
      </Text>

      {isLoading ? (
        <View className="bg-white rounded-2xl p-6 items-center">
          <ActivityIndicator size="small" color="#C6415A" />
        </View>
      ) : conceptFiles.length === 0 ? (
        <View className="bg-white rounded-2xl p-6 items-center">
          <Feather name="file-text" size={28} color="#C6C0C1" />
          <Text className="text-muted text-xs mt-2">
            No materials uploaded yet
          </Text>
        </View>
      ) : (
        <View className="bg-white rounded-2xl overflow-hidden">
          {conceptFiles.map((file, index) => (
            <View
              key={file.id}
              className={`flex-row items-center px-4 py-3.5 gap-3 ${
                index !== conceptFiles.length - 1 ? 'border-b border-blush' : ''
              }`}
            >
              <TouchableOpacity
                onPress={() => onPressFile?.(file)}
                className="flex-row items-center flex-1 gap-3"
              >
                <View className="bg-rose/10 rounded-lg p-2.5">
                  <Feather name="file-text" size={18} color="#C6415A" />
                </View>

                <View className="flex-1">
                  <Text className="text-ink text-sm font-medium" numberOfLines={1}>
                    {file.originalName}
                  </Text>
                  <Text className="text-muted text-[11px] mt-0.5">
                    {formatFileSize(file.sizeBytes)}
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setTargetFile({ id: file.id, name: file.originalName })}
                className="p-2 bg-gray-100 rounded-full"
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Feather name="trash-2" size={18} color="#3D1024" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      <DeleteConfirmModal
        visible={targetFile !== null}
        fileName={targetFile?.name ?? ""}
        loading={loadingDelete}
        onCancel={() => setTargetFile(null)}
        onConfirm={handleConfirmDelete}
      />


    </View>
  );
};

export default MaterialsSection;