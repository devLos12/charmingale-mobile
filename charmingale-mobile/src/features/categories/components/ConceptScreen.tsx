import { router } from 'expo-router';
import { View, Text, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { useCategoryStore } from '../store';
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import LoadingScreen from '@/components/common/loadingScreen';
import { useUpdateConcept } from '../hooks/useUpdateConcept';
import {  MaterialsSection, UploadFileButton } from '@/features/files';



import { useDashboardStore } from '@/features/dashboard/store';
import { useNotificationStore } from '@/features/notification/store';




const SEGMENT_COUNT = 12;



const ConceptScreen = ({ conceptId }: { conceptId: string }) => {
  const { conceptDetails, getConceptDetails, loading } = useCategoryStore();
  const [remaining, setRemaining] = useState<number>(0);
  const [running, setRunning] = useState<boolean>(false);
  const { markConceptTopicCompleted, pauseRemainingSecond } = useUpdateConcept();
  const [hasStarted, setHasStarted] = useState(false);

  const { getDashboardStats } = useDashboardStore();
  const { getNotification } = useNotificationStore();

  

  
  useEffect(() => {
    getConceptDetails(Number(conceptId));
  }, [conceptId]);

  
  useEffect(() => {
    if (conceptDetails) {
      setRemaining(conceptDetails.remainingSeconds ?? conceptDetails.allocatedMinutes * 60);
    }
  }, [conceptDetails?.id]);


  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [running]);
  


  useEffect( () => {
    const completeConcept = async () => {
        if (hasStarted && remaining === 0 && conceptDetails && !conceptDetails.completed) {
          const success = await markConceptTopicCompleted(conceptDetails.id);

          if (!success) return;

          router.push({
            pathname: '/concept-completed',
            params: {
              conceptText: conceptDetails.conceptText,
              allocatedMinutes: String(conceptDetails.allocatedMinutes),
            },
          });

          getDashboardStats();
          getNotification();
        }
      };

    completeConcept();
  }, [remaining]);


  if (loading.isConceptDetails || !conceptDetails) return <LoadingScreen />;



  
  const totalSeconds = conceptDetails.allocatedMinutes * 60;
  const progress = totalSeconds > 0 ? (totalSeconds - remaining) / totalSeconds : 0;
  const filledSegments = conceptDetails.completed
    ? SEGMENT_COUNT
    : Math.round(progress * SEGMENT_COUNT);

  

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <>
      <SafeAreaView className="flex-1 bg-blush" edges={['top']}>

        {/* Minimal top bar */}
        <View className="flex-row items-center p-6 gap-3 bg-transparent">
          <TouchableOpacity
              onPress={() => router.back()}
              className="h-10 w-10 items-center justify-center rounded-full bg-rose/10"
              activeOpacity={0.8}
          >
              <Feather name="arrow-left" size={20} color="#8E1145" />
          </TouchableOpacity>

          
          <Text className='text-xl font-medium text-roseDeep'>Concept Details</Text>
        </View>

        <ScrollView className="flex-1 px-6" contentContainerStyle={{ paddingBottom: 40 }}>

          {/* Breadcrumb -- quiet, no label chrome */}
          <Text className="text-muted text-xs mt-2">
            {conceptDetails.groupLabel
              ? `${conceptDetails.groupLabel} · ${conceptDetails.topicHeader}`
              : conceptDetails.topicHeader}
          </Text>

          {/* Concept title -- the hero copy */}
          <Text className="text-ink text-3xl font-bold mt-2 mb-10 leading-9">
            {conceptDetails.conceptText}
          </Text>

          {/* Timer -- big digits, no boxed card */}
          {/* Timer panel -- white card, both states share the same shape */}
          <View className="bg-white rounded-2xl p-6 items-center mb-6">
            {conceptDetails.completed ? (
              <View className="bg-green-100 rounded-full p-4 mb-3">
                <Feather name="check" size={32} color="#16a34a" />
              </View>
            ) : (
              <View className="bg-rose/10 rounded-full p-4 mb-3">
                <Feather name="clock" size={32} color="#C6415A" />
              </View>
            )}

            <Text className="text-ink text-6xl font-bold tracking-tight">
              {formatTime(remaining)}
            </Text>

            <Text className="text-muted text-xs mt-2 mb-6">
              {conceptDetails.completed
                ? 'Completed'
                : running
                ? 'Studying now'
                : 'Ready to study'}{' '}
              · {conceptDetails.allocatedMinutes} min allocated
            </Text>


            
            {/* Segmented progress meter -- each block is a slice of the allocated time */}
            <View className="flex-row gap-1 w-full mb-6">
              {Array.from({ length: SEGMENT_COUNT }).map((_, i) => (
                <View
                  key={i}
                  className={`flex-1 h-2 rounded-full ${
                    i < filledSegments ? 'bg-rose' : 'bg-rose/15'
                  }`}
                />
              ))}
            </View>
            

            <TouchableOpacity
              className={`bg-rose rounded-2xl py-4 items-center flex-row justify-center gap-2 w-full ${
                conceptDetails.completed ? 'opacity-50' : ''
              }`}
              onPress={ async () => {
                const isPausing = running;
                setRunning((prev) => !prev);
                if (!hasStarted) setHasStarted(true);
                if (isPausing) {
                  const success = await pauseRemainingSecond(conceptDetails.id, remaining);
                  if(success) getNotification();
                }
              }}

              disabled={conceptDetails.completed || remaining === 0}
            >
              <Feather name={running ? 'pause' : 'play'} size={16} color="#FFFFFF" />
              <Text className="text-white font-semibold text-sm">
                {running ? 'Pause' : 'Start studying'}
              </Text>
            </TouchableOpacity>
          </View>


          {conceptDetails.pauseCount > 0 && (
            <Text className="text-muted text-xs text-center font-medium">
              Paused Counts: {conceptDetails.pauseCount}
            </Text>
          )}
          
          <MaterialsSection 
            conceptId={conceptDetails.id} 
            onPressFile={(file) =>
              router.push(`/pdf-viewer?url=${encodeURIComponent(file.storedFilename)}`)
            } 
          />
          
          <UploadFileButton
            conceptId={conceptDetails.id}
            onUploaded={() => getConceptDetails(conceptDetails.id)}
          />

        </ScrollView>


      </SafeAreaView>
    </>
  );
};

export default ConceptScreen;