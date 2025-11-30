import { AudioService } from "@/services/audio.service";
import { ApiResponse } from "@/types/api-response";
import { AudioFile, UploadAudio } from "@/types/audio-config";
import { toastr } from "@/utils/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { startTransition } from "react";


export const useGetAllAudioFiles = (username: string) => {
  return useQuery<AudioFile[]>({
    queryKey: ["user-audio-files", username],
    queryFn: () => AudioService.getAllUserAudioFiles(username),
  });
}

export const useUploadAudioFile = (username: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["upload-audio-file"],
    mutationFn: async (data: UploadAudio) => {
      await AudioService.sendAudioFile(data);
    },
    onSuccess: () => {
      toastr.success("Audio file uploaded successfully.");
      startTransition(() => {
        queryClient.invalidateQueries({ queryKey: ["user-audio-files", username] });
      });
    },
    onError: (error: AxiosError<ApiResponse>) => {
      console.error("Error uploading audio file:", error);
      toastr.error("Failed to upload audio file.");
    },
  });
}