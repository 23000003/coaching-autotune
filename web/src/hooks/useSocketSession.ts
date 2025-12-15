import { Message } from "@/types/chat";
import { Session } from "@/types/session";
import { useEffect, useRef, useCallback, useState } from "react";

type Props = {
  session: Session;
  setChatMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

const useSocketSession = (props: Props) => {
  const socketRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const BASE_URL = "ws://localhost:8000/api/studio";

  useEffect(() => {
    const rt_url = `${BASE_URL}/ws/${props.session.sessionId}/${props.session.role}`;
    console.log("Connecting to WebSocket:", rt_url);
    
    const ws = new WebSocket(rt_url);
    socketRef.current = ws;

    ws.onopen = () => {
      console.log(`Connected to WebSocket at ${rt_url}`);
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      console.log("Message received:", event.data);
      try {
        const message: Message = JSON.parse(event.data);
        props.setChatMessages((prev) => [...prev, message]);
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
  }, [props.session.role, props.session.sessionId]);

  const sendMessage = useCallback((message: Message) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      try {
        socketRef.current.send(JSON.stringify(message));
        console.log("Message sent:", message);
      } catch (err) {
        console.error("Error sending message:", err);
      }
    } else {
      console.error("WebSocket is not connected. Current state:", socketRef.current?.readyState);
    }
  }, []);

  return { sendMessage, isConnected };
};

export default useSocketSession;
