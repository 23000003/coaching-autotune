import { AudioControls } from "@/components/audio-controls";
import AudioOutputs from "@/components/audio-outputs";
import AudioPlayer from "@/components/audio-player";
import { AudioRecorder } from "@/components/audio-recorder";
import { useGetAllAudioFiles, useUploadAudioFile } from "@/hooks/useAudioCreator";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { AudioConfig, UploadAudio } from "@/types/audio-config";
import { useState } from "react";

const Studio = () => {
  
  const [audioConfig, setAudioConfig] = useState<AudioConfig>({
    retune_speed: 0,
    flex_tune: 0,
    humanize: 0,
    vibrato: 0,
    volume: 100
  });

  const { 
    data: userAudioFiles, 
    isLoading, 
    isError 
  } = useGetAllAudioFiles("kenny");

  const { 
    mutate: uploadAudioFile
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
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading audio files...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2 mb-12">
          <h1 className="text-4xl font-bold text-foreground tracking-tight">
            Audio Studio
          </h1>
          <p className="text-muted-foreground">
            Professional audio recording with real-time pitch correction
          </p>
        </div>
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
          />
        )}
        <AudioOutputs 
          files={userAudioFiles}
          selectedFileId={player.selectedFile?.id || null}
          onSelectFile={player.selectFile}
        />
        <AudioControls 
          audioConfig={audioConfig}
          setAudioConfig={setAudioConfig}
        />
      </div>
    </div>
  );
};

export default Studio;
