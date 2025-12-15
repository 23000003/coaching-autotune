import { create } from "zustand";
import { AudioConfig } from "@/types/audio-config";
import { SessionRole } from "@/types/session.d";

type StudioSessionAsCoach = {
  audioConfig: AudioConfig;
  role: SessionRole;
  studioName: string;
  inSession: boolean;
  setAudioConfig: (audioConfig: AudioConfig) => void;
  setRole: (role: SessionRole) => void;
  setInSession: (inSession: boolean) => void;
  setStudioName: (name: string) => void;
};

const useStudioSessionStore = create<StudioSessionAsCoach>((set) => ({
  audioConfig: {
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
  },
  role: SessionRole.LEARNER,
  studioName: localStorage.getItem("studio_name"),
  inSession: false,
  setInSession: (inSession) => set({ inSession }),
  setRole: (role) => set({ role }),
  setStudioName: (studioName) => set({ studioName }),
  setAudioConfig: (audioConfig) => set({ audioConfig })
}));

export default useStudioSessionStore;