import { View, Text, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import ConfettiOverlay from '@/components/ui/ConfettiOverlay';

// idagdag sa baba:
import SuccessBadge from '@/components/ui/SuccessBadge';


export default function ConceptCompletedScreen() {
  const { conceptText, allocatedMinutes } = useLocalSearchParams<{
    conceptText: string;
    allocatedMinutes: string;
  }>();

  return (
    <SafeAreaView className="flex-1 bg-blush">

      {/* Confetti overlay -- SVG pieces falling from top */}
      <ConfettiOverlay />

      <View className="flex-1 items-center justify-center px-8">

        {/* Icon -- soft shadow instead of hard border */}
  <View
  className="items-center justify-center mb-6"
  style={{
    shadowColor: '#16a34a',
    shadowOpacity: 0.2,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  }}
>
  <SuccessBadge size={100} />
</View>

        <Text className="text-ink text-3xl font-bold mb-2 text-center">
          Topic Completed!
        </Text>
        <Text className="text-muted text-sm text-center leading-5 mb-8 px-4">
          {conceptText}
        </Text>

        {/* Stat pill instead of plain text */}
        <View className="flex-row items-center gap-2 bg-white rounded-full px-5 py-2.5 mb-5 border border-rose/10">
          <Feather name="clock" size={14} color="#C6195C" />
          <Text className="text-ink text-xs font-semibold">
            {allocatedMinutes} min studied
          </Text>
        </View>

        <TouchableOpacity
          className="bg-rose rounded-2xl py-4 items-center flex-row justify-center gap-2 w-full"
          style={{
            shadowColor: '#C6195C',
            shadowOpacity: 0.25,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 6 },
            elevation: 4,
          }}
          onPress={() => {router.back()}}
        >
          <Text className="text-white font-semibold text-sm">Back to Topics</Text>
          <Feather name="arrow-right" size={16} color="#fff" />
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}