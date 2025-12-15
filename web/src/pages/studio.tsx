import { AudioControls } from "@/components/studio/audio-controls";
import AudioOutputs from "@/components/studio/audio-outputs";
import AudioPlayer from "@/components/studio/audio-player";
import { AudioRecorder } from "@/components/studio/audio-recorder";
import { ChatPopover } from "@/components/chat/chat-popover";
import { useGetAllAudioFiles, useUploadAudioFile } from "@/hooks/useAudioCreator";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { AudioConfig, UploadAudio } from "@/types/audio-config";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

const Studio = () => {
  
  const [audioConfig, setAudioConfig] = useState<AudioConfig>({
    // Autotune
    retune_speed: 0.15,    // slow/natural retune
    humanize: 4,           // subtle natural variation in cents
    pitch_shift: 0,        // no pitch shift by default
    noise_filtering_enabled: false,

    // FX
    fx_enabled: false,
    air: 3,                // high-shelf gain in dB
    compression: 0.5,      // medium vocal tightness
    chorus: 0.2,           // subtle width
    reverb: 0.3,           // light space
    delay: 0.2,            // short echo
  });

  const { 
    data: userAudioFiles, 
    isLoading, 
    isError 
  } = useGetAllAudioFiles("kenny");

  const { 
    mutate: uploadAudioFile,
    isPending: isUploading
  } = useUploadAudioFile("kenny");

  const handleUpload = (wavBlob: Blob) => {
    uploadAudioFile({
      file: wavBlob,
      username: "kenny",
      ...audioConfig
    });
  }

  const recorder = useAudioRecorder(handleUpload);
  const player = useAudioPlayer();

  if (isLoading || isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <Loader2 className="h-12 w-12 text-primary animate-spin" />
          <p className="text-muted-foreground">Loading audio files...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-2 mb-12"
        >
          <h1 className="text-4xl font-bold text-foreground tracking-tight">
            Audio Studio
          </h1>
          <p className="text-muted-foreground">
            Professional audio recording with real-time pitch correction
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {player.selectedFile ? (
            <AudioPlayer
              file={player.selectedFile}
              isPlaying={player.isPlaying}
              currentTime={player.currentTime}
              duration={player.duration}
              volumeLevel={player.volumeLevel}
              onTogglePlayPause={player.togglePlayPause}
              onStop={player.stop}
              onSeek={player.seek}
              onClose={player.clearSelection}
              formatTime={player.formatTime}
            />
          ) : (
            <AudioRecorder
              isRecording={recorder.isRecording}
              isPaused={recorder.isPaused}
              recordingTime={recorder.recordingTime}
              volumeLevel={recorder.volumeLevel}
              onStartRecording={recorder.startRecording}
              onStopRecording={recorder.stopRecording}
              onTogglePause={recorder.togglePause}
              onResetRecording={recorder.resetRecording}
              isUploading={isUploading}
            />
          )}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <AudioOutputs 
            files={userAudioFiles}
            selectedFileId={player.selectedFile?.id || null}
            onSelectFile={player.selectFile}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <AudioControls 
            audioConfig={audioConfig}
            setAudioConfig={setAudioConfig}
          />
        </motion.div>
      </div>
      <ChatPopover />
    </div>
  );
};

export default Studio;
