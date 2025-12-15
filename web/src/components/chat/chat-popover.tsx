import { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, X, ArrowLeft, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SessionRole } from "@/types/session.d";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/config/axios";
import { CoachRoomListView, RoleSelectionView } from "./selection-view";
import ChatRoom from "./chat-room";
import { Message, Room } from "@/types/chat";
import useStudioSessionStore from "@/store/useStudioSessionStore";
import useChatSession from "@/hooks/useChatSession";

export const ChatPopover = () => {

  const { setRole: setSessionRole, setInSession } = useStudioSessionStore();

  const [isOpen, setIsOpen] = useState(false);
  const [role, setRole] = useState<SessionRole>(null);
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);

  const { data: rooms } = useQuery({
    queryKey: ["rooms"],
    queryFn: async () => {
      const res = await api.get<{ rooms: Room[] }>("/studio/sessions");
      return res.data.rooms;
    },
  })

  const { sendMessage } = useChatSession({
    session: {
      sessionId: selectedRoom,
      role: role,
    },
    setChatMessages: setMessages,
  })

  console.log("Rooms data:", rooms);

  const handleBack = () => {
    if (role === SessionRole.COACH) {
      setSessionRole(SessionRole.LEARNER);
    } else {
      setRole(null);
    }
    setSelectedRoom("");
    setInSession(false);
  };

  const currentRoom = rooms?.find((r) => r.room_id === selectedRoom);
  const hasCoach = currentRoom?.has_coach || role === SessionRole.COACH;

  console.log(hasCoach, "hasCoach status");

  const renderContent = () => {
    if (!role) {
        return (
          <RoleSelectionView 
            setRole={setRole} 
            setSelectedRoom={setSelectedRoom} 
          />
        )
    };
    if (role === SessionRole.COACH && selectedRoom === "") {
      return (
        <CoachRoomListView 
          rooms={rooms || []} 
          handleBack={() => setRole(null)} 
          setSelectedRoom={setSelectedRoom} 
        />
      )
    };
    return (
      <ChatRoom 
        role={role}
        selectedRoom={selectedRoom}
        hasCoach={hasCoach}
        handleBack={handleBack}
        messages={messages}
        sendMessage={sendMessage}
      />
    );
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          size="icon"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 z-50"
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <MessageCircle className="h-6 w-6" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="end"
        sideOffset={16}
        className="w-80 h-96 p-0 flex flex-col bg-card border-border"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        {renderContent()}
      </PopoverContent>
    </Popover>
  );
};
