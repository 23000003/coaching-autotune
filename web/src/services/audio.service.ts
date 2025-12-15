import { api } from "@/config/axios";
import { ApiResponse } from "@/types/api-response";
import { AudioConfig, AudioFile, UploadAudio, UserAudioFilesResponse } from "@/types/audio-config.d";
import { convertToAudioFiles } from "@/utils/covert-to-audiofile";

const BASE_PATH = "/audio";

export const AudioService = {
  getAllUserAudioFiles: async (username: string): Promise<AudioFile[]> => {
    const res = await api.get<ApiResponse<UserAudioFilesResponse>>(`${BASE_PATH}/all-audio-files/${username}`);
    
    if (!res.data.success) throw new Error(res.data.message);
    if (!res.data.data) return [];

    return await convertToAudioFiles(res.data.data);
  },
  sendAudioFile: async (data: UploadAudio) => {
    const formData = new FormData();

    formData.append("file", data.file, "recording.wav");
    formData.append("username", data.username);

    formData.append("retune_speed", data.retune_speed.toString());
    formData.append("humanize", data.humanize.toString());
    formData.append("pitch_shift", data.pitch_shift.toString());
    formData.append("noise_filtering_enabled", data.noise_filtering_enabled ? "true" : "false");

    formData.append("fx_enabled", data.fx_enabled ? "true" : "false");
    formData.append("air", data.air.toString());
    formData.append("compression", data.compression.toString());
    formData.append("chorus", data.chorus.toString());
    formData.append("reverb", data.reverb.toString());
    formData.append("delay", data.delay.toString());

    const res = await api.post<ApiResponse<{ file_url: string }>>(`${BASE_PATH}/upload_audio`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (!res.data.success) throw new Error(res.data.message);

    return res.data.data?.file_url;
  }
};
