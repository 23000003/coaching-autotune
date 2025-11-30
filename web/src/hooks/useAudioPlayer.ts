import { AudioFile } from "@/types/audio-config";
import { useState, useRef, useCallback, useEffect } from "react";

export const useAudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [selectedFile, setSelectedFile] = useState<AudioFile | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array<ArrayBuffer> | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const updateVolumeLevel = useCallback(() => {
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

  const startVolumeUpdates = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    updateVolumeLevel();
  }, [updateVolumeLevel]);

  const stopVolumeUpdates = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    setVolumeLevel(0);
  }, []);

  const selectFile = useCallback((file: AudioFile) => {
    // Cleanup previous
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    setSelectedFile(file);
    setIsPlaying(false);
    setCurrentTime(0);
    setVolumeLevel(0);

    const audio = new Audio(file.url);
    audioRef.current = audio;

    audio.addEventListener("loadedmetadata", () => {
      setDuration(audio.duration);
    });

    audio.addEventListener("timeupdate", () => {
      setCurrentTime(audio.currentTime);
    });

    audio.addEventListener("ended", () => {
      setIsPlaying(false);
      stopVolumeUpdates();
    });
  }, [stopVolumeUpdates]);

  const play = useCallback(() => {
    if (!audioRef.current || !selectedFile) return;

    // Setup audio context for visualization on first play
    if (!audioContextRef.current) {
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      analyserRef.current = analyser;

      const bufferLength = analyser.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLength) as Uint8Array<ArrayBuffer>;

      const source = audioContext.createMediaElementSource(audioRef.current);
      sourceRef.current = source;
      source.connect(analyser);
      analyser.connect(audioContext.destination);
    }

    audioRef.current.play();
    setIsPlaying(true);
    startVolumeUpdates();
  }, [selectedFile, startVolumeUpdates]);

  const pause = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
    stopVolumeUpdates();
  }, [stopVolumeUpdates]);

  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const seek = useCallback((time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  }, []);

  const stop = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
    setCurrentTime(0);
    stopVolumeUpdates();
  }, [stopVolumeUpdates]);

  const clearSelection = useCallback(() => {
    stop();
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setSelectedFile(null);
    setDuration(0);
  }, [stop]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return {
    isPlaying,
    currentTime,
    duration,
    volumeLevel,
    selectedFile,
    selectFile,
    togglePlayPause,
    stop,
    seek,
    clearSelection,
    formatTime,
  };
};
