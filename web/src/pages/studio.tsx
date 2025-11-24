import { AudioControls } from "@/components/audio-controls";
import { AudioRecorder } from "@/components/audio-recorder";

const Studio = () => {
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

        <AudioRecorder />
        <AudioControls />
      </div>
    </div>
  );
};

export default Studio;
