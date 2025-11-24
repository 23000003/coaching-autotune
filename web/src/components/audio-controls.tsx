import { Slider } from "@/components/ui/slider";

export const AudioControls = () => {
  
  // Placeholder values for audio controls, these would be managed via state -
  // based on the audio configurations for auto tune

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="bg-card rounded-2xl p-8 border border-border shadow-2xl">
        <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
          <span className="h-1 w-1 rounded-full bg-primary animate-pulse" />
          Audio Configuration
        </h2>

        {/* Knobs Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-border">
          <ControlKnob label="Pitch" value={65} unit="%" />
          <ControlKnob label="Formant" value={50} unit="%" />
          <ControlKnob label="Retune" value={75} unit="ms" />
          <ControlKnob label="Mix" value={80} unit="%" />
        </div>

        {/* Sliders Section */}
        <div className="grid md:grid-cols-2 gap-6">
          <ControlSlider label="Pitch Correction" value={72} />
          <ControlSlider label="Natural Vibrato" value={45} />
          <ControlSlider label="Throat Length" value={50} max={200} unit="%" />
          <ControlSlider label="Humanize" value={35} />
        </div>

        {/* Additional Controls */}
        <div className="mt-8 pt-6 border-t border-border grid md:grid-cols-3 gap-6">
          <ControlSlider label="Input Gain" value={60} max={150} unit="%" />
          <ControlSlider label="Output Gain" value={80} max={150} unit="%" />
          <ControlSlider label="Dry/Wet" value={70} />
        </div>
      </div>
    </div>
  );
};

interface ControlKnobProps {
  label: string;
  value: number;
  unit?: string;
}

const ControlKnob = ({ label, value, unit = "" }: ControlKnobProps) => {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <div className="h-20 w-20 rounded-full bg-control border-2 border-border flex items-center justify-center">
          <div className="h-16 w-16 rounded-full bg-knob-track relative overflow-hidden">
            <div
              className="absolute bottom-0 left-0 right-0 bg-knob-fill transition-all duration-200"
              style={{ height: `${value}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-1 w-8 bg-foreground rounded-full" style={{ 
                transform: `rotate(${-135 + (value / 100) * 270}deg)`,
                transformOrigin: 'center'
              }} />
            </div>
          </div>
        </div>
      </div>
      <div className="text-center">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="text-sm font-semibold text-foreground">
          {value}{unit}
        </div>
      </div>
    </div>
  );
};

interface ControlSliderProps {
  label: string;
  value: number;
  max?: number;
  unit?: string;
}

const ControlSlider = ({ label, value, max = 100, unit = "" }: ControlSliderProps) => {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="text-sm font-semibold text-foreground">
          {value}{unit}
        </span>
      </div>
      <Slider
        value={[value]}
        max={max}
        className="cursor-pointer"
      />
    </div>
  );
};
