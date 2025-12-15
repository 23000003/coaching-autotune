export type Message = {
  text: string;
  sender: SessionRole;
  timestamp: Date;
}

interface Room {
  room_id: string;
  has_coach: boolean;
  has_learner: boolean;
}
