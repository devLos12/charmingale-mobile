import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import Pdf from 'react-native-pdf';
import { File, Directory, Paths } from 'expo-file-system';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';





export default function PdfViewerScreen() {
  const { url } = useLocalSearchParams<{ url: string }>();
  const decodedUrl = url ? decodeURIComponent(url) : '';
  
  const [localUri, setLocalUri] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<number>(0); // 0 to 100%



  // Auto-cleanup mechanism for old cached files (>3 days)
  const cleanupOldCache = (pdfDir: Directory) => {
    try {
      const contents = pdfDir.list();
      const MAX_AGE_MS = 3 * 24 * 60 * 60 * 1000; // 3 days
      const now = Date.now();

      contents.forEach((item) => {
        if (item instanceof File) {
          const { modificationTime } = item.info();

          if (modificationTime && now - modificationTime > MAX_AGE_MS) {
            item.delete();
          }
        }
      });

      
    } catch (err) {
      console.log('Cache Cleanup Warning:', err);
    }
  };

  useEffect(() => {
    const downloadAndCachePdf = async () => {
      try {
        if (!decodedUrl) return;

        // Extract and clean up the filename
        const uriParts = decodedUrl.split('/');
        const rawFilename = uriParts[uriParts.length - 1] || `doc_${Date.now()}.pdf`;

        const cleanFilename = rawFilename
          .split('?')[0]
          .replace(/[^a-zA-Z0-9._-]/g, '_');

        // Prepare cache directory
        const pdfDir = new Directory(Paths.cache, 'pdfs');
        if (!pdfDir.exists) {
          pdfDir.create();
        } else {
          cleanupOldCache(pdfDir);
        }

        const targetFile = new File(pdfDir, cleanFilename);

        // Check if file already exists in cache
        if (targetFile.exists) {
          setDownloadProgress(100);
          setLocalUri(targetFile.uri);
          return;
        }

        // Download file with progress callback
        
        const downloadedFile = await File.downloadFileAsync(encodeURI(decodedUrl), targetFile, {
        
          onProgress: (event: any) => {
            const total = event.totalBytesExpected ?? event.totalBytesExpectedToWrite;
            const current = event.totalBytesWritten;

            if (total > 0) {
              const progress = Math.round((current / total) * 100);
              setDownloadProgress(progress);
            }
          },
        });

        setLocalUri(downloadedFile.uri);
      } catch (err) {
        console.error('PDF Download Error:', err);
        setError('Failed to load the PDF file.');
      }
    };

    downloadAndCachePdf();
  }, [decodedUrl]);





  return (
    <SafeAreaView className="flex-1 bg-blush">
      {/* Top Header Bar */}
      <View className="flex-row items-center p-6 bg-transparent gap-3">
          <TouchableOpacity
              onPress={() => router.back()}
              className="h-10 w-10 items-center justify-center rounded-full bg-rose/10"
              activeOpacity={0.8}
          >
              <Feather name="arrow-left" size={20} color="#8E1145" />
          </TouchableOpacity>
          <Text className="text-lg font-bold flex-1 text-roseDeep" numberOfLines={1}>
          PDF Viewer
          </Text>
      </View>
      

      {/* Screen Body / States */}
      {error ? (
        <View className="flex-1 items-center justify-center p-6">
          <Feather name="alert-circle" size={48} color="#ef4444" />
          <Text className="text-red-500 font-semibold mt-3 text-center">{error}</Text>
        </View>
      ) : !localUri ? (
        <View className="flex-1 items-center justify-center px-8">
          <ActivityIndicator size="large" color="#C6415A" />

          {/* Progress Percent Text */}
          <Text className="text-ink font-bold text-base mt-4">
            {downloadProgress > 0 ? `${downloadProgress}%` : 'Preparing...'}
          </Text>
          <Text className="text-muted text-xs mt-1">Opening PDF file...</Text>

          {/* Progress Bar UI */}
          <View className="w-full bg-gray-200 h-2 rounded-full mt-4 overflow-hidden">
            <View
              className="bg-rose h-full rounded-full"
              style={{ width: `${downloadProgress}%` }}
            />
          </View>
        </View>
      ) : (
        <View className="flex-1">
          <Pdf
            source={{ uri: localUri, cache: true }}
            style={{ flex: 1, width: '100%', height: '100%', backgroundColor: '#fff' }}
            onError={(err) => {
              console.log('PDF Render Error:', err);
              setError('Failed to render PDF.');
            }}
          />
        </View>
      )}
    </SafeAreaView>
  );
}