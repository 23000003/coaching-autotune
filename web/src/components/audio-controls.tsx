import { Dispatch, SetStateAction, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { AudioConfig } from "@/types/audio-config";

type Props = {
  audioConfig: AudioConfig;
  setAudioConfig: Dispatch<SetStateAction<AudioConfig>>;
}

export const AudioControls = ({ audioConfig, setAudioConfig }: Props) => {

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="bg-card rounded-2xl p-8 border border-border shadow-2xl">
        <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
          Audio Configuration
        </h2>

        {/* Sliders Section */}
        <div className="grid md:grid-cols-2 gap-6">
          <ControlSlider 
            label="Retune Speed" 
            value={audioConfig.retune_speed} 
            onChange={(v) => setAudioConfig(prev => ({ ...prev, retune_speed: v }))} 
          />
          <ControlSlider 
            label="Flex Tune" 
            value={audioConfig.flex_tune} 
            onChange={(v) => setAudioConfig(prev => ({ ...prev, flex_tune: v }))} 
          />
          <ControlSlider 
            label="Humanize" 
            value={audioConfig.humanize} 
            onChange={(v) => setAudioConfig(prev => ({ ...prev, humanize: v }))} 
          />
          <ControlSlider 
            label="Vibrato" 
            value={audioConfig.vibrato} 
            onChange={(v) => setAudioConfig(prev => ({ ...prev, vibrato: v }))} 
          />
        </div>

        {/* Additional Controls */}
        <div className="mt-8 pt-6 border-t border-border grid md:grid-cols-3 gap-6">
          <ControlSlider 
            label="Volume" 
            value={audioConfig.volume} 
            max={100} 
            unit="%" 
            onChange={(v) => setAudioConfig(prev => ({ ...prev, volume: v }))}
          />
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
  onChange?: (value: number) => void;
}

const ControlSlider = ({ label, value, max = 100, unit = "", onChange }: ControlSliderProps) => {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="text-sm font-semibold text-foreground">{value}{unit}</span>
      </div>
      <Slider
        value={[value]}
        max={max}
        className="cursor-pointer"
        onValueChange={(val: number[]) => onChange && onChange(val[0])}
      />
    </div>
  );
};
