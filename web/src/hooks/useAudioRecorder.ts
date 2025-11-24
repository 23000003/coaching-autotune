import { toastr } from "@/utils/toast";
import { useState, useRef, useEffect, useCallback } from "react";
import { convertToWav } from "@/utils/convert-to-wav";
import { AudioService } from "@/services/audio.service";

export const useAudioRecorder = () => {

  const [isUploading, setIsUploading] = useState(false);

  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [volumeLevel, setVolumeLevel] = useState<number>(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array<ArrayBuffer> | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startTimeRef = useRef<number>(0);
  const pausedTimeRef = useRef<number>(0);

  const updateVolumeLevel = useCallback(function updateVolumeLevelInternal() {
    if (!analyserRef.current || !dataArrayRef.current) return;

    analyserRef.current.getByteTimeDomainData(dataArrayRef.current);
    
    let sum = 0;
    for (let i = 0; i < dataArrayRef.current.length; i++) {
      sum += Math.abs(dataArrayRef.current[i] - 128);
    }
    const average = sum / dataArrayRef.current.length;
    const volume = Math.min(100, (average / 128) * 100 * 2);

    setVolumeLevel(volume);
    animationFrameRef.current = requestAnimationFrame(updateVolumeLevel);
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        }
      });

      streamRef.current = stream;

      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      analyserRef.current = analyser;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength) as Uint8Array<ArrayBuffer>;
      dataArrayRef.current = dataArray;

      const source = audioContext.createMediaStreamSource(stream);
      sourceRef.current = source;
      source.connect(analyser);

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      // Collects chunks
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      // Upload when stopped
      mediaRecorder.onstop = async () => {
        setIsUploading(true);
        const webmBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        chunksRef.current = [];

        const wavBlob = await convertToWav(webmBlob);

        try {
          const fileUrl = await AudioService.sendAudioFile(wavBlob, { volume: 10 }, "kenny");
          toastr.success("Audio uploaded!");
          console.log("WAV File URL:", fileUrl);
        } catch (err) {
          console.error(err);
          toastr.error("Failed to upload audio");
        } finally {
          setIsUploading(false);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setIsPaused(false);
      startTimeRef.current = Date.now();

      updateVolumeLevel();
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toastr.error("Could not access microphone. Check permissions.");
    }
  };

  const stopRecording = () => {
    if (!mediaRecorderRef.current || !isRecording) return;

    mediaRecorderRef.current.stop();
    setIsRecording(false);
    setIsPaused(false);
    setRecordingTime(0);

    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    if (sourceRef.current) sourceRef.current.disconnect();
    if (audioContextRef.current) audioContextRef.current.close();

    setVolumeLevel(0);
  };

  const togglePause = () => {
    if (!mediaRecorderRef.current) return;

    if (isPaused) {
      mediaRecorderRef.current.resume();
      startTimeRef.current = Date.now() - pausedTimeRef.current;
      updateVolumeLevel();
    } else {
      mediaRecorderRef.current.pause();
      pausedTimeRef.current = Date.now() - startTimeRef.current;
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    }
    setIsPaused(!isPaused);
  };

  const resetRecording = () => stopRecording();

  useEffect(() => {
    let interval: number | undefined;

    if (isRecording && !isPaused) {
      interval = window.setInterval(() => {
        setRecordingTime(Date.now() - startTimeRef.current);
      }, 100);
    }

    return () => interval && clearInterval(interval);
  }, [isRecording, isPaused]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, []);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return {
    isRecording,
    isPaused,
    recordingTime: formatTime(recordingTime),
    volumeLevel,
    startRecording,
    stopRecording,
    togglePause,
    resetRecording,
  };
};
