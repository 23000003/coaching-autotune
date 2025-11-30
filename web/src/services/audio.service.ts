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
    formData.append("volume", data.volume.toString());
    formData.append("username", data.username);
    formData.append("retune_speed", data.retune_speed.toString());
    formData.append("flex_tune", data.flex_tune.toString());
    formData.append("humanize", data.humanize.toString());
    formData.append("vibrato", data.vibrato.toString());

    const res = await api.post<ApiResponse<{ file_url: string }>>(`${BASE_PATH}/upload_audio`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (!res.data.success) throw new Error(res.data.message);

    return res.data.data?.file_url;
  }
};
