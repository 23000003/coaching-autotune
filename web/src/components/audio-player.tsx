import { Play, Pause, Square, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { AudioFile } from "@/types/audio-config";

type AudioPlayerProps = {
  file: AudioFile;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volumeLevel: number;
  onTogglePlayPause: () => void;
  onStop: () => void;
  onSeek: (time: number) => void;
  onClose: () => void;
  formatTime: (seconds: number) => string;
}

const AudioPlayer = ({
  file,
  isPlaying,
  currentTime,
  duration,
  volumeLevel,
  onTogglePlayPause,
  onStop,
  onSeek,
  onClose,
  formatTime,
}: AudioPlayerProps) => {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      <div className="bg-card rounded-2xl p-8 border border-border shadow-2xl">
        <div className="space-y-6">
          {/* Header with file info and close button */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-lg ${
                  file.type === "raw" ? "bg-destructive/20" : "bg-primary/20"
                }`}
              >
                <span
                  className={`text-xs font-bold uppercase ${
                    file.type === "raw" ? "text-destructive" : "text-primary"
                  }`}
                >
                  {file.type}
                </span>
              </div>
              <div>
                <h3 className="font-medium text-foreground">{file.name}</h3>
                <p className="text-xs text-muted-foreground">
                  Click play to listen
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Time Display */}
          <div className="flex justify-between items-center text-muted-foreground text-sm">
            <span className="font-mono">{formatTime(currentTime)}</span>
            <span className="font-mono">
              {isPlaying ? "PLAYING" : "PAUSED"} - {formatTime(duration)}
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
                    className="flex-1 rounded-full transition-all duration-75"
                    style={{
                      height: "60%",
                      opacity: isActive && isPlaying ? 0.9 : 0.2,
                      backgroundColor:
                        file.type === "processed"
                          ? "hsl(var(--primary))"
                          : "hsl(var(--destructive))",
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* Seek Bar */}
          <div className="space-y-2">
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={0.1}
              onValueChange={([value]) => onSeek(value)}
              className="cursor-pointer"
            />
          </div>

          {/* Transport Controls */}
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-full border-border hover:border-destructive hover:bg-destructive/10"
              onClick={onStop}
            >
              <Square className="h-5 w-5" />
            </Button>

            <Button
              size="icon"
              className={`h-16 w-16 rounded-full shadow-lg ${
                file.type === "processed"
                  ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/20"
                  : "bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-destructive/20"
              }`}
              onClick={onTogglePlayPause}
            >
              {isPlaying ? (
                <Pause className="h-7 w-7" />
              ) : (
                <Play className="h-7 w-7 ml-1" />
              )}
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-full border-border hover:border-muted-foreground hover:bg-muted/10"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;