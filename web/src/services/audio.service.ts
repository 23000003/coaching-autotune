import { api } from "@/config/axios";
import { ApiResponse } from "@/types/api-response";
import { AudioConfig } from "@/types/audio-config.d";

const BASE_PATH = "/audio";

export const AudioService = {
  sendAudioFile: async (file: Blob, data: AudioConfig, username: string) => {
    const formData = new FormData();

    formData.append("file", file, "recording.wav");
    formData.append("volume", data.volume.toString());
    formData.append("username", username);

    const res = await api.post<ApiResponse<{ file_url: string }>>(`${BASE_PATH}/upload_audio`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (!res.data.success) throw new Error(res.data.message);

    return res.data.data?.file_url;
  }
};
