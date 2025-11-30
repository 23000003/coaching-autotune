import { FileAudio, AudioLines } from "lucide-react";
import { cn } from "@/lib/utils";
import { AudioFile } from "@/types/audio-config";

interface RecordedFilesProps {
  files: AudioFile[];
  selectedFileId: string | null;
  onSelectFile: (file: AudioFile) => void;
}

const AudioOutputs = ({
  files,
  selectedFileId,
  onSelectFile,
}: RecordedFilesProps) => {
  const rawFiles = files.filter((f) => f.type === "raw");
  const processedFiles = files.filter((f) => f.type === "processed");

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${String(secs).padStart(2, "0")}`;
  };

  const FileItem = ({ file }: { file: AudioFile }) => (
    <button
      onClick={() => onSelectFile(file)}
      className={cn(
        "w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200",
        "hover:bg-secondary/80 text-left group",
        selectedFileId === file.id
          ? "bg-primary/20 border border-primary/40"
          : "bg-secondary/40 border border-transparent"
      )}
    >
      <div
        className={cn(
          "p-2 rounded-lg",
          file.type === "raw" ? "bg-destructive/20" : "bg-primary/20"
        )}
      >
        {file.type === "raw" ? (
          <FileAudio className="h-4 w-4 text-destructive" />
        ) : (
          <AudioLines className="h-4 w-4 text-primary" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">
          {file.name}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatDuration(file.duration)}
        </p>
      </div>
      {selectedFileId === file.id && (
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
      )}
    </button>
  );

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="bg-card rounded-2xl p-6 border border-border shadow-2xl">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Recorded Files
        </h2>

        {files.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileAudio className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No recordings yet</p>
            <p className="text-sm">Start recording to see your files here</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Raw Files */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded bg-destructive/20">
                  <FileAudio className="h-4 w-4 text-destructive" />
                </div>
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Raw Audio
                </h3>
                <span className="text-xs text-muted-foreground/60">
                  ({rawFiles.length})
                </span>
              </div>
              <div className="space-y-2">
                {rawFiles.length === 0 ? (
                  <p className="text-sm text-muted-foreground/60 py-2">
                    No raw files
                  </p>
                ) : (
                  rawFiles.map((file) => <FileItem key={file.id} file={file} />)
                )}
              </div>
            </div>

            {/* Processed Files */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded bg-primary/20">
                  <AudioLines className="h-4 w-4 text-primary" />
                </div>
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Processed Audio
                </h3>
                <span className="text-xs text-muted-foreground/60">
                  ({processedFiles.length})
                </span>
              </div>
              <div className="space-y-2">
                {processedFiles.length === 0 ? (
                  <p className="text-sm text-muted-foreground/60 py-2">
                    No processed files
                  </p>
                ) : (
                  processedFiles.map((file) => (
                    <FileItem key={file.id} file={file} />
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioOutputs;