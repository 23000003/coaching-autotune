import { Play, Pause, Circle, RotateCcw, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SessionRole } from "@/types/session.d";

interface AudioRecorderProps {
  isRecording: boolean;
  isPaused: boolean;
  recordingTime: string;
  volumeLevel: number;
  isUploading: boolean;
  role: SessionRole;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onTogglePause: () => void;
  onResetRecording: () => void;
}

export const AudioRecorder = ({
  isRecording,
  isPaused,
  isUploading,
  recordingTime,
  volumeLevel,
  onStartRecording,
  onStopRecording,
  onTogglePause,
  onResetRecording,
  role
}: AudioRecorderProps) => {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      {/* Waveform Display */}
      <div className="bg-card rounded-2xl p-8 border border-border shadow-2xl">
        <div className="space-y-6">
          {/* Time Display */}
          <div className="flex justify-between items-center text-muted-foreground text-sm">
            <span className="font-mono">{recordingTime}</span>
            <span className="font-mono">
              {isRecording ? (isPaused ? "PAUSED" : "RECORDING") : "READY"}
            </span>
          </div>

          {/* Volume Level Visualization */}
          <div className="relative h-48 bg-secondary rounded-xl overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center gap-1 px-4">
              {Array.from({ length: 100 }).map((_, i) => {
                const isActive = (i / 100) * 100 < volumeLevel;
                return (
                  <div
                    key={i}
                    className="flex-1 bg-waveform rounded-full transition-all duration-75"
                    style={{
                      height: '60%',
                      opacity: isActive && isRecording && !isPaused ? 0.9 : 0.2,
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* Transport Controls */}
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-full border-border hover:border-primary hover:bg-primary/10"
              onClick={onResetRecording}
              disabled={!isRecording}
            >
              <RotateCcw className="h-5 w-5" />
            </Button>
            
            {!isRecording ? (
              <Button
                size="icon"
                className="h-16 w-16 rounded-full bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-lg shadow-destructive/20"
                onClick={onStartRecording}
                disabled={isUploading || role === SessionRole.COACH}
              >
                {isUploading ? (
                  <RotateCcw className="h-7 w-7 fill-current animate-spin" />
                ) : (
                  <Circle className="h-7 w-7 fill-current" />
                )}
              </Button>
            ) : (
              <>
                <Button
                  size="icon"
                  className="h-16 w-16 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
                  onClick={onTogglePause}
                >
                  {isPaused ? (
                    <Play className="h-7 w-7 ml-1" />
                  ) : (
                    <Pause className="h-7 w-7" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-full border-border hover:border-destructive hover:bg-destructive/10"
                  onClick={onStopRecording}
                >
                  <Square className="h-5 w-5" />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
