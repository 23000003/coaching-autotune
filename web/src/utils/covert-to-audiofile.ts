import { AudioFile, UserAudioFilesResponse } from "@/types/audio-config";

// convert Base64 to Blob
const base64ToBlob = (base64: string, mimeType: string = 'audio/wav'): Blob => {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
};

// get audio duration from blob
const getAudioDuration = (blob: Blob): Promise<number> => {
  return new Promise((resolve) => {
    const audio = new Audio();
    const url = URL.createObjectURL(blob);
    audio.src = url;
    audio.addEventListener('loadedmetadata', () => {
      resolve(audio.duration || 0);
      URL.revokeObjectURL(url);
    });
    audio.addEventListener('error', () => {
      resolve(0);
      URL.revokeObjectURL(url);
    });
  });
};

// convert response to AudioFile array
export const convertToAudioFiles = async (response: UserAudioFilesResponse): Promise<AudioFile[]> => {
  const audioFiles: AudioFile[] = [];
  
  for (let i = 0; i < response.raw_files.length; i++) {
    const base64Data = response.raw_files[i];
    const blob = base64ToBlob(base64Data.encoded_data);
    const url = URL.createObjectURL(blob);
    const duration = await getAudioDuration(blob);

    audioFiles.push({
      id: `raw-${i}-${Date.now()}`,
      name: response.raw_files[i].filename,
      type: 'raw',
      blob,
      url,
      duration,
      createdAt: new Date()
    });
  }
  
  for (let i = 0; i < response.processed_files.length; i++) {
    const base64Data = response.processed_files[i];
    const blob = base64ToBlob(base64Data.encoded_data);
    const url = URL.createObjectURL(blob);
    const duration = await getAudioDuration(blob);
    
    audioFiles.push({
      id: `processed-${i}-${Date.now()}`,
      name: response.processed_files[i].filename,
      type: 'processed',
      blob,
      url,
      duration,
      createdAt: new Date()
    });
  }
  
  return audioFiles;
};
