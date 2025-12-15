import { SessionRole } from "@/types/session.d";
import { Button } from "../ui/button";
import { ArrowLeft, Users } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { SetStateAction } from "react";
import { Room } from "@/types/chat";

type RoleSelectionViewProps = {
  setRole: React.Dispatch<React.SetStateAction<SessionRole | null>>;
  setSelectedRoom: React.Dispatch<React.SetStateAction<string | null>>;
};

export const RoleSelectionView = ({ setRole, setSelectedRoom }: RoleSelectionViewProps) => {
  
  const uuid : string = crypto.randomUUID();

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 p-6">
      <h3 className="text-lg font-semibold text-foreground mb-2">Choose Your Role</h3>
      <Button
        onClick={() => {
          setRole(SessionRole.LEARNER);
          setSelectedRoom(uuid); // Auto-join room 1 as learner
        }}
        className="w-full h-12 text-base"
        variant="default"
      >
        I'm a Learner
      </Button>
      <Button
        onClick={() => setRole(SessionRole.COACH)}
        className="w-full h-12 text-base"
        variant="outline"
      >
        I'm a Coach
      </Button>
    </div>
  )
}

type CoachRoomListViewProps = {
  rooms: Room[];
  handleBack: () => void;
  setSelectedRoom: React.Dispatch<SetStateAction<string | null>>;
};

  
export const CoachRoomListView = ({ rooms, handleBack, setSelectedRoom }: CoachRoomListViewProps) => {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border flex items-center gap-3">
        <Button size="icon" variant="ghost" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h3 className="font-semibold text-foreground">Available Rooms</h3>
          <p className="text-xs text-muted-foreground">Select a room to coach</p>
        </div>
      </div>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-2">
          {rooms.filter(r => !r.has_coach).map((room) => (
            <button
              key={room.room_id}
              onClick={() => setSelectedRoom(room.room_id)}
              className="w-full p-4 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors text-left flex items-center gap-3"
            >
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">Room #{room.room_id}</p>
                <p className="text-xs text-muted-foreground">Waiting for coach</p>
              </div>
            </button>
          ))}
          {rooms.filter(r => !r.has_coach).length === 0 && (
            <p className="text-center text-muted-foreground py-8">No learners waiting</p>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}