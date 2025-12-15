import useStudioSessionStore from "@/store/useStudioSessionStore";
import { AudioConfig } from "@/types/audio-config";
import { Message } from "@/types/chat";
import { Session, SessionRole } from "@/types/session.d";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useCallback, useState, Dispatch, SetStateAction } from "react";

type Props = {
  session: Session;
  inSession: boolean;
  setAudioConfig: Dispatch<SetStateAction<AudioConfig>>
}


const useLearnersValuesSession = (props: Props) => {
  const queryClient = useQueryClient();

  const socketRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const BASE_URL = "ws://localhost:8000/api/studio";

  useEffect(() => {
    if(props.inSession === false) return;
    
    const rt_url = `${BASE_URL}/ws/${props.session.sessionId}/${props.session.role}/config-values`;
    console.log("Connecting to WebSocket:", rt_url);
    
    const ws = new WebSocket(rt_url);
    socketRef.current = ws;

    ws.onopen = () => {
      console.log(`Connected to WebSocket at ${rt_url}`);
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        if(props.session.role === SessionRole.COACH) {
          console.log("Message received:", event.data);
          const message: { audio_config: AudioConfig; invalidate?: string } = JSON.parse(event.data);
          if(message.audio_config.retune_speed === null) {
            queryClient.invalidateQueries({ queryKey: ["user-audio-files", props.session.sessionId] });
          } else {
            props.setAudioConfig(message.audio_config);
          }
        };
        
      } catch (err) {
        console.error("Failed to parse message:", err);
      }
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
      setIsConnected(false);
    };

    ws.onclose = (event) => {
      console.log(`WebSocket disconnected. Code: ${event.code}, Reason: ${event.reason}`);
      setIsConnected(false);
    };

    return () => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close(1000, "Component unmounted");
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.session.role, props.session.sessionId, props.inSession]);

  const sendConfigValues = useCallback((values: AudioConfig) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      try {
        socketRef.current.send(JSON.stringify(values));
        console.log("Message sent:", values);
      } catch (err) {
        console.error("Error sending message:", err);
      }
    } else {
      console.error("WebSocket is not connected. Current state:", socketRef.current?.readyState);
    }
  }, []);

  return { sendConfigValues, isConnected };
};

export default useLearnersValuesSession;
