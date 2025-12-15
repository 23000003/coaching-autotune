import { ArrowLeft, Send } from "lucide-react";
import { Button } from "../ui/button";
import { SessionRole } from "@/types/session.d";
import { ScrollArea } from "../ui/scroll-area";
import { Input } from "../ui/input";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import useSocketSession from "@/hooks/useSocketSession";
import { Message } from "@/types/chat";
import { useQueryClient } from "@tanstack/react-query";

type Props = {
  role: SessionRole;
  selectedRoom: string;
  hasCoach: boolean;
  handleBack: () => void;
}

const ChatRoom = (props: Props) => {

  const queryClient = useQueryClient();

  const { 
    role, 
    selectedRoom, 
    hasCoach, 
    handleBack, 
  } = props;
  
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { sendMessage } = useSocketSession({
    session: {
      sessionId: selectedRoom.toString(),
      role: role,
    },
    setChatMessages: setMessages,
  })

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);


  const formatTime = (date: Date | string | null) => {
    const dateObj = typeof date === "string" ? 
      new Date(date) : 
        date === null ? 
          new Date() : 
            date;
    return dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      text: inputValue.trim(),
      sender: role,
      timestamp: new Date(),
    };
    sendMessage(newMessage);
    setInputValue("");
  }

  const renderSystem = (text: string) => {
    queryClient.invalidateQueries({ queryKey: ["rooms"] })
    return (
      <div className="flex justify-center" key={text}>
        <div className="bg-secondary/50 rounded-lg px-4 py-2 text-sm text-muted-foreground">
          {text}
        </div>
      </div>
    )
  }

  console.log("Messages:", messages);

  return (
    <>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Button size="icon" variant="ghost" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-sm font-medium text-primary">
              {role === SessionRole.LEARNER ? "L" : "C"}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">
              Room #{selectedRoom.slice(0,2)}
            </h3>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <span className={`h-2 w-2 rounded-full ${hasCoach ? "bg-green-500" : "bg-yellow-500"}`} />
              {role === SessionRole.COACH ? 
                "Coaching" : 
                  hasCoach ? 
                    "Coach connected" : 
                      "Waiting for coach..."}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4 overflow-y-auto" ref={scrollRef}>
        <div className="space-y-4">
          
          <div className="flex justify-center">
            <div className="bg-secondary/50 rounded-lg px-4 py-2 text-sm text-muted-foreground">
              {!hasCoach && role === SessionRole.LEARNER ? ( 
                <>Waiting for a coach to join...</>
              ) : 
                <>You have joined the room as a {role}.</>
              }
            </div>
          </div>
          {messages.map((message) => (
            message.sender === SessionRole.SYSTEM ? (
              renderSystem(message.text)
            ) : (
              <div
                key={message.timestamp.toString()}
                className={`flex ${
                  message.sender === role ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[75%] rounded-lg px-3 py-2 ${
                    message.sender === role
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p
                    className={`text-[10px] mt-1 ${
                      message.sender === role
                        ? "text-primary-foreground/70"
                        : "text-muted-foreground"
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            )
          ))}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-3 border-t border-border">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={hasCoach ? "Type a message..." : "Waiting for coach..."}
            className="flex-1 bg-secondary border-border"
            disabled={!hasCoach && role === SessionRole.LEARNER}
          />
          <Button
            size="icon"
            onClick={ handleSendMessage }
            disabled={!inputValue.trim() || (!hasCoach && role === SessionRole.LEARNER)}
            className="bg-primary hover:bg-primary/90"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  )
}

export default ChatRoom;

