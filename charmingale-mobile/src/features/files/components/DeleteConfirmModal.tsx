import { Modal, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import type { DeleteConfirmModalProps } from '../types';



export const DeleteConfirmModal = ({
  visible,
  fileName,
  loading,
  onCancel,
  onConfirm,
}: DeleteConfirmModalProps) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View className="flex-1 bg-black/40 items-center justify-center px-8">
        <View className="bg-white rounded-2xl p-6 w-full max-w-sm">
          {/* icon */}
          <View className="bg-rose/10 self-center rounded-full p-3 mb-4">
            <Feather name="trash-2" size={24} color="#C6195C" />
          </View>

          {/* title */}
          <Text className="text-ink text-base font-bold text-center mb-1.5">
            Delete file?
          </Text>

          {/* message */}
          <Text className="text-muted text-sm text-center mb-6" numberOfLines={2}>
            Remove "{fileName}"? This can't be undone.
          </Text>

          {/* actions */}
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={onCancel}
              disabled={loading}
              className="flex-1 bg-gray-100 rounded-xl py-3 items-center"
            >
              <Text className="text-ink text-sm font-semibold">Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onConfirm}
              disabled={loading}
              className="flex-1 bg-rose rounded-xl py-3 items-center"
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text className="text-white text-sm font-semibold">Delete</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};