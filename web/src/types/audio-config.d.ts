export type UploadAudio = {
  file: Blob;
  username: string;
} & AudioConfig;

export type AudioConfig = {
  retune_speed: number; // 0 - 1.0
  humanize: number; // 0 - 40
  pitch_shift: number; // semitones -12 to +12
  noise_filtering_enabled: boolean;

  // FX
  fx_enabled: boolean;
  air: number;        // High-shelf gain (dB)
  compression: number; // Vocal tightness
  chorus: number;     // Width
  reverb: number;     // Space
  delay: number;      // Echo
};

// Base64-encoded WAV file data
type UserAudioFilesResponse = {
  username: string;
  raw_files: {
    filename: string;
    encoded_data: string;
  }[];      
  processed_files: {
    filename: string;
    encoded_data: string;
  }[];
}

export type AudioFile = {
  id: string;
  name: string;
  type: 'raw' | 'processed';
  blob: Blob;
  url: string;
  duration: number;
  createdAt: Date;
}