import { Slider } from "@/components/ui/slider";

export const AudioControls = () => {
  
  // Placeholder values for audio controls, these would be managed via state -
  // based on the audio configurations for auto tune

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="bg-card rounded-2xl p-8 border border-border shadow-2xl">
        <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
          Audio Configuration
        </h2>

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
