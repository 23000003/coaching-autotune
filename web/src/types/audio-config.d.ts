export type UploadAudio = {
  file: Blob;
  username: string;
} & AudioConfig;

export type AudioConfig = {
  volume: number;
  flex_tune: number;
  retune_speed: number;
  humanize: number;
  vibrato: number;
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