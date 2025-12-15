import { Dispatch, SetStateAction, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { AudioConfig } from "@/types/audio-config";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { AlertCircle } from "lucide-react";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";

type Props = {
  audioConfig: AudioConfig;
  setAudioConfig: Dispatch<SetStateAction<AudioConfig>>;
  isCoach: boolean;
}


export const AudioControls = ({ audioConfig, setAudioConfig, isCoach }: Props) => {
  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="bg-card rounded-2xl p-8 border border-border shadow-2xl">
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
            Audio Configuration
          </h2>
          <div className="flex items-center gap-3">
            <Label htmlFor="filtering-toggle" className="text-sm text-muted-foreground cursor-pointer">
              Noise filtering {audioConfig.noise_filtering_enabled ? ' On' : ' Off'}
            </Label>
            <Switch
              id="filtering-toggle"
              checked={audioConfig.noise_filtering_enabled}
              onCheckedChange={(checked) => setAudioConfig(prev => ({ ...prev, noise_filtering_enabled: checked }))}
            />
            <span className="border px-2 py-1 rounded mb-auto text-[14px]">
              C Major
            </span>
          </div>
        </div>

        {/* Sliders Section */}
        <div className="grid md:grid-cols-2 gap-6">
          <ControlSlider 
            label="Retune Speed" 
            value={audioConfig.retune_speed} 
            max={1.5}
            disabled={isCoach}
            tooltip="Controls how quickly pitch is corrected. Higher values result in a more robotic sound."
            onChange={(v) => setAudioConfig(prev => ({ ...prev, retune_speed: v }))} 
          />
          <ControlSlider 
            label="Humanize" 
            value={audioConfig.humanize} 
            max={40}
            disabled={isCoach}
            tooltip="Adds slight random pitch variations to mimic natural singing imperfections."
            onChange={(v) => setAudioConfig(prev => ({ ...prev, humanize: v }))} 
          />
          <ControlSlider 
            label="Pitch Shift" 
            value={audioConfig.pitch_shift} 
            max={12}
            min={-12}
            disabled={isCoach}
            tooltip="Shifts the pitch up or down by a number of semitones."
            onChange={(v) => setAudioConfig(prev => ({ ...prev, pitch_shift: v }))} 
          />
        </div>

        {/* Additional Controls */}
        <div className="mt-8 pt-6 border-t">
          <div className="flex gap-4 items-center">
            <h2 className="font-semibold">Vocal Effects</h2>
            <Switch
              id="noise-filtering"
              checked={audioConfig.fx_enabled}
              disabled={isCoach}
              onCheckedChange={(checked) => setAudioConfig(prev => ({ ...prev, fx_enabled: checked }))}
            />
          </div>
          <div className="border-border mt-4 grid md:grid-cols-3 gap-6">
            <ControlSlider
              label="Air (High-Shelf)"
              value={audioConfig.air}
              max={8}
              disabled={!audioConfig.fx_enabled || isCoach}
              tooltip="Boosts high frequencies to add brightness and clarity to the vocal."
              onChange={(v) => setAudioConfig(prev => ({ ...prev, air: v }))}
            />
            <ControlSlider
              label="Compression"
              value={audioConfig.compression}
              max={1}
              disabled={!audioConfig.fx_enabled || isCoach}
              tooltip="Controls how tight and consistent the vocal sounds."
              onChange={(v) => setAudioConfig(prev => ({ ...prev, compression: v }))}
            />

            <ControlSlider
              label="Chorus"
              value={audioConfig.chorus}
              max={0.4}
              disabled={!audioConfig.fx_enabled || isCoach}
              tooltip="Adds stereo width and thickness to the vocal."
              onChange={(v) => setAudioConfig(prev => ({ ...prev, chorus: v }))}
            />

            <ControlSlider
              label="Reverb"
              value={audioConfig.reverb}
              max={0.5}
              disabled={!audioConfig.fx_enabled || isCoach}
              tooltip="Adds room ambience around the vocal."
              onChange={(v) => setAudioConfig(prev => ({ ...prev, reverb: v }))}
            />

            <ControlSlider
              label="Delay"
              value={audioConfig.delay}
              max={0.35}
              disabled={!audioConfig.fx_enabled || isCoach}
              tooltip="Adds echo for depth and vibe."
              onChange={(v) => setAudioConfig(prev => ({ ...prev, delay: v }))}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

interface ControlSliderProps {
  label: string;
  value: number;
  tooltip: string;
  max?: number;
  min?: number;
  disabled?: boolean;
  onChange?: (value: number) => void;
}

const ControlSlider = ({ label, value, max = 100, tooltip, min = 0, onChange, disabled = false }: ControlSliderProps) => {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <div>
          <Tooltip>
            <TooltipTrigger asChild>
              <AlertCircle className="inline-block mr-2 h-4 w-4 text-muted-foreground cursor-pointer" />
            </TooltipTrigger>
            <TooltipContent>
              <p>{tooltip}</p>
            </TooltipContent>
          </Tooltip>
          <span className="text-sm text-muted-foreground">{label}</span>
        </div>
        <span className="text-sm font-semibold text-foreground">{value}</span>
      </div>
      <Slider
        value={[value]}
        max={max}
        min={min}
        step={0.01}
        disabled={disabled}
        className="cursor-pointer"
        onValueChange={(val: number[]) => onChange && onChange(val[0])}
      />
    </div>
  );
};
