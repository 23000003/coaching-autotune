
export enum SessionRole {
  USER = "USER",
  COACH = "COACH",
}

// Stored in session storage to keep track of their sessions
export type SessionStorage = {
  sessionId: string;
  username: string;
  role: SessionRole;
};

// Displays all room's and their sessions
// isFull indicates if the room already has both USER and COACH
export type RoomSessions = {
  isFull: boolean;
  sessions: SessionStorage[];
}